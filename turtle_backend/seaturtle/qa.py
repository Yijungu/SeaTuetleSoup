from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import openai
from .models import SeaTurtle, Keyword, SubmitProblem
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
    temperature=0,
    model_name='gpt-3.5-turbo'
    max_tokens = 10
)
embeddings = OpenAIEmbeddings(openai_api_key=openai_apikey)
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
sentences_kr = [""]
loader = None
documents = None
texts = None
docsearch = None
qa_chain = None
qa_chain_submit = None
author = ""
k = 1
keywords = None
answer_plus = ""
problem = ""
story = ""
correct_answer = ""
main_character = ""

def question(query):
    llm_response = qa_chain(query)
    return llm_response['result']

def submit(answer):
    llm_response = qa_chain(answer)
    print(llm_response['result'])
    if llm_response['result'].startswith('네'):
        global problem
        answer += " 가 '" +problem+ "'에 대한 답이 맞아?"
        llm_response = qa_chain_submit(answer)
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
    keywords = list(Keyword.objects.filter(date = today))
    global n_number
    n_number += 1
    global author
    author = seaturtle[0].author
    global main_character
    main_character = seaturtle[0].main_character
    answer_plus_edit()
    export_and_delete()
    return 0

def getProblem():
    global last_date
    current_date = datetime.now(pytz.timezone('Asia/Seoul')).date()
    global n_number
    if last_date != current_date or n_number == 0:
        get_story()
        last_date = current_date
    return problem, author, main_character

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
