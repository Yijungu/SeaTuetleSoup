from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import openai
from .models import SeaTurtle, Keyword, SubmitProblem, Hint
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import hgtk
import pytz
import csv

n_number = 0
last_date = datetime.now(pytz.timezone('Asia/Seoul')).date()
load_dotenv()
openai_apikey = os.getenv('API_KEY')
os.environ["OPENAI_API_KEY"] = openai_apikey
openai.api_key = openai_apikey

turbo_llm = ChatOpenAI(
    temperature = 0,
    model_name = 'gpt-3.5-turbo-0613',
    # frequency_penalty = 0
    # max_tokens = 10
)

turbo_llm2 = ChatOpenAI(
    temperature = 1,
    model_name = 'gpt-3.5-turbo-0613',
    # frequency_penalty = 0
    # max_tokens = 10
)

embeddings = OpenAIEmbeddings(openai_api_key=openai_apikey)
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
sentences_kr = [""]
loader = None
documents = None
texts = None
docsearch = None
qa_chain = None
qa_chain2 = None
qa_chain_submit = None
author = ""
k = 1
keywords = None
answer_plus = ""
problem = ""
story = ""
correct_answer = ""
main_character = ""
problem_en = ""
hints = []

def check_start(text):
    if text.startswith('Yes'):
        return 'Yes'
    elif text.startswith('No'):
        return 'No'
    else:
        return 'None'

def remove_first_word(s):
    words = s.split(" ")
    return " ".join(words[1:]) if len(words) > 1 else ''


def question(query):
    for keyword in keywords:
        # word = keyword.word[::-1]
        # alternative_word = keyword.alternative_word[::-1]
        # reversed_text = query[::-1]  # Reverse the string
        query = query.replace(keyword.word, keyword.alternative_word, 1)
        # query = reversed_replaced_text[::-1] 
    messages = []
    query += " 이 문장을 영어로 번역해줘."

    chat_response1 = qa_chain(query)
    llm_response = qa_chain(chat_response1['result'] + " imagine it.")
    if llm_response['result'].startswith('Yes') or llm_response['result'].startswith('No'):
        response = remove_first_word(llm_response['result'])
    else :
        response = llm_response['result']

    messages = []
    content =  "Given the information that " + response
    content += " can we confirm that " + chat_response1['result']
    content += " please answer 'yes.' or 'no.' or 'probably.' or 'probably not.' or 'Ambiguous."  
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response = completion.choices[0].message.content
    # llm_response = qa_chain(content)
    messages = []
    query1 = chat_response + "Does this sentence contain the meaning of not?  Please answer 'yes' or 'no."
    messages.append({"role" : "user", "content": query1})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content

    if chat_response3.startswith('Yes'):
        if 'Yes' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Yes', 'No')
        elif 'No' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('No', 'Yes')
        elif 'Probably right' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Probably right', 'Probably not')
        elif 'Probably not'in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Probably not', 'Probably right')
    
    return chat_response1['result'], chat_response
    # return llm_response['result'] + content

def submit(answer):
    messages = []
    answer += " 이 문장을 영어로 자연스럽게 번역해줘."
    messages.append({"role" : "user", "content": answer})

    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response = completion.choices[0].message.content
    chat_response = chat_response.split("?")[0]+"?"
    llm_response = qa_chain(chat_response)
    
    if llm_response['result'].startswith('Yes'):
        global problem
        result = "Is the statement " + chat_response + " a sufficient response to the question " +problem_en
        llm_response = qa_chain_submit(result)
        return llm_response['result']
    return llm_response['result']

def answer_plus_edit():
    global keywords
    keywords_str = ", ".join(keyword.word for keyword in keywords)
    global answer_plus
    answer_plus = " 여기에 "+ keywords_str + "이랑 비슷한 단어들이 들어가 있어?"
    # print(answer_plus)
    return 0

def get_story():
    korea_timezone = pytz.timezone('Asia/Seoul')
    now = datetime.now(korea_timezone)
    today = now.day
    seaturtle = SeaTurtle.objects.filter(date = today)
    global story
    # print(seaturtle[0].story)
    global correct_answer
    correct_answer = seaturtle[0].correct_answer
    story = seaturtle[0].story
    title = str(today) + ".txt"
    with open(title, 'w') as f:
            f.write(story + '\n')
    loader = TextLoader(title)
    documents = loader.load()
    texts = text_splitter.split_documents(documents)
    docsearch = Chroma.from_documents(texts, embeddings)
    global qa_chain
    qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    global qa_chain2
    qa_chain2 = RetrievalQA.from_chain_type(llm=turbo_llm2,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    
    title = str(today) + "_correct.txt"
    with open(title, 'w') as f:
            f.write(correct_answer + '\n')
    loader = TextLoader(title)
    documents = loader.load()
    texts = text_splitter.split_documents(documents)
    docsearch = Chroma.from_documents(texts, embeddings)
    global problem
    problem = seaturtle[0].problem
    global qa_chain_submit
    qa_chain_submit = RetrievalQA.from_chain_type(llm=turbo_llm,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    
    global keywords
    keywords = Keyword.objects.filter(date = today)

    global hints
    hints = Hint.objects.filter(date = today)

    global n_number
    n_number += 1
    global author
    author = seaturtle[0].author
    global main_character
    main_character = seaturtle[0].main_character
    
    global problem_en
    messages = []
    messages.append({"role" : "user", "content": problem + " 이 문장을 영어로 바꿔줘."})

    completion = openai.ChatCompletion.create(
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    problem_en = completion.choices[0].message.content
    
    export_and_delete()
    return 0

def getProblem():
    global last_date
    current_date = datetime.now(pytz.timezone('Asia/Seoul')).date()
    global n_number
    if last_date != current_date or n_number == 0:
        get_story()
        last_date = current_date
    return problem, author, main_character, hints

def getStory():
    return correct_answer

def getNnumber():
    return n_number

def attach_josa(word):
    last_char = word[-1]
    if hgtk.checker.is_hangul(last_char):  # 단어가 한글인지 확인
        char_info = hgtk.letter.decompose(last_char)
        if char_info[2] == '':  # 받침이 없는 경우
            return word + '는'
        else:  # 받침이 있는 경우
            return word + '은'
    else:
        return word

def export_and_delete():
    # 현재 시간을 한국 시간으로 설정
    timezone = pytz.timezone('Asia/Seoul')
    yesterday = datetime.now(timezone) - timedelta(days=1)

    # 모든 데이터 가져오기
    data = SubmitProblem.objects.all()

    # csv 파일로 저장
    with open('submit_problem_{}.csv'.format(yesterday.strftime('%Y_%m_%d')), 'w', newline='') as csvfile:
        fieldnames = ['user', 'problem', 'explanation']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for obj in data:
            writer.writerow({'user': obj.user, 'problem': obj.problem, 'explanation': obj.explanation})

    # 테이블의 모든 데이터 삭제
    data.delete()

def get_first_sentence(text):
    # 문장의 끝을 나타내는 구두점
    sentence_ender = '.'

    # '.'에 대해 첫 번째 등장 위치를 찾습니다.
    end_position = text.find(sentence_ender)

    if end_position != -1:
        # 문장의 끝 위치를 찾아 문장을 반환합니다.
        return text[:end_position + 1]
    else:
        # '.'이 없는 경우 전체 텍스트를 반환합니다.
        return text
    
def getHints():
    return hints

def changeAiQeustion(query): 
    query += " Please rephrase this sentence in a more natural way."
    llm_response = qa_chain2(query)
    llm_response['result'] = llm_response['result'].split("?")[0]+"?"
    return llm_response['result']

def question_en(query):
    llm_response = qa_chain(query + " imagine it.")
    if llm_response['result'].startswith('Yes') or llm_response['result'].startswith('No'):
        response = remove_first_word(llm_response['result'])
    else :
        response = llm_response['result']

    messages = []
    content =  "Given the information that " + response
    content += " can we confirm that " + query
    content += " please answer 'yes.' or 'no.' or 'probably.' or 'probably not.' or 'Ambiguous."  
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response = completion.choices[0].message.content
    # llm_response = qa_chain(content)
    messages = []
    query1 = chat_response + "Does this sentence contain the meaning of not?  Please answer 'yes' or 'no."
    messages.append({"role" : "user", "content": query1})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content

    if chat_response3.startswith('Yes'):
        if 'Yes' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Yes', 'No')
        elif 'No' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('No', 'Yes')
        elif 'Probably right' in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Probably right', 'Probably not')
        elif 'Probably not'in llm_response['result']:
            llm_response['result'] = llm_response['result'].replace('Probably not', 'Probably right')
    
    return chat_response