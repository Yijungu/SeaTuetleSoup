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

turbo_llm4 = ChatOpenAI(
    temperature = 1,
    model_name = 'gpt-4',
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
qa_chain4 = None
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
    query += " Translate this into English."
    chat_response1 = qa_chain(query)
    chat_response1['result'] = chat_response1['result'].split("?")[0]+"?"

    messages = []
    content =  chat_response1['result'] + " Please change it into a declarative sentence."
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response3 = completion.choices[0].message.content

    llm_response_tf = qa_chain(chat_response3)
    if llm_response_tf['result'].startswith('Yes') :
        llm_response = qa_chain(chat_response1['result']+" tell me why.")
    else :
        llm_response = qa_chain(chat_response1['result']+" please imagine this story.")
    if llm_response['result'].startswith('Yes') or llm_response['result'].startswith('No'):
        response = remove_first_word(llm_response['result'])
    else :
        response = llm_response['result']

    messages = []

    content =  "Given the information that " + response
    content += " can we confirm that " + chat_response1['result']
    content += " please answer 'yes.' or 'no.' or 'probably.' or 'probably not.' or 'i don't no'"  
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response = completion.choices[0].message.content
    # llm_response = qa_chain(content)
    messages = []
    
    messages = []
    messages.append({"role" : "user", "content": chat_response1['result'] + " Translate this into Korean."})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content

    # messages = []
    # answer_tf = "Amy overheard the nurse reassuring the doctor. Would posing the question, '"
    # answer_tf += chat_response1['result']+"' be of any help in this context?"
    # answer_tf1 = qa_chain(answer_tf)

    # return chat_response1['result'], chat_response, chat_response3
    return chat_response1['result'], chat_response, chat_response3

def submit(answer):
    answer += " Translate this into English."
    chat_response1 = qa_chain(answer)
    llm_response = qa_chain(chat_response1['result'])

    # if llm_response['result'].startswith('Yes'):
    global problem_en
    global answer_plus
    result = answer_plus+chat_response1['result']
    llm_response1 = qa_chain_submit(result+" please imagine this story.")

    messages = []
    messages.append({"role" : "user", "content": chat_response1['result'] + " Translate this into Korean."})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content
    return chat_response1['result'], chat_response3, llm_response1['result']
    return "1: "+ chat_response1['result'] + llm_response['result']


def get_story():
    korea_timezone = pytz.timezone('Asia/Seoul')
    now = datetime.now(korea_timezone)
    today = now.day
    seaturtle = SeaTurtle.objects.filter(date = today)
    global story
    # print(seaturtle[0].story)
    global correct_answer
    correct_answer = seaturtle[0].correct_answer
    global answer_plus
    answer_plus = seaturtle[0].answer_plus
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
    
    global qa_chain4
    qa_chain4 = RetrievalQA.from_chain_type(llm=turbo_llm4,
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
    messages.append({"role" : "user", "content": problem + " Translate this into English."})

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

    messages = []
    messages.append({"role" : "user", "content": llm_response['result'] + " Translate this into Korean."})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content
    return llm_response['result'], chat_response3

def question_en(query):
    messages = []
    content =  query + " Please change it into a declarative sentence."
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response3 = completion.choices[0].message.content

    llm_response_tf = qa_chain(chat_response3)
    if llm_response_tf['result'].startswith('Yes') :
        llm_response = qa_chain(query+" tell me why.")
    else :
        llm_response = qa_chain(query+" please imagine this story.")
    if llm_response['result'].startswith('Yes') or llm_response['result'].startswith('No'):
        response = remove_first_word(llm_response['result'])
    else :
        response = llm_response['result']

    messages = []
    content =  "Given the information that " + response
    content += " can we confirm that " + query
    content += " please answer 'yes.' or 'no.' or 'probably.' or 'probably not.'"
    messages.append({"role" : "user", "content": content})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages,
    )
    chat_response = completion.choices[0].message.content

    return chat_response, content