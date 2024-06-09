from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.callbacks import get_openai_callback
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains.question_answering import load_qa_chain

import tiktoken

import openai
from .models import *
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import hgtk
import pytz
import csv

n_number = 0
start_date = datetime(2023, 7, 18, tzinfo=pytz.timezone('Asia/Seoul')).date()
last_date = datetime(2023, 7, 18, tzinfo=pytz.timezone('Asia/Seoul')).date()
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
    temperature = 0,
    model_name = 'gpt-4',
    # frequency_penalty = 0
    max_tokens = 4
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
qa_chain_translate = None
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

question_number = 0
people_number = 0
docsearch1 = None

def check_start(text) :
    if text.startswith('Yes') :
        return 'Yes'
    elif text.startswith('No') :
        return 'No'
    else :
        return 'None'

def remove_first_word(s):
    words = s.split(" ")
    return " ".join(words[1:]) if len(words) > 1 else ''

def num_tokens_from_string(string: str) -> int:
    encoding = tiktoken.get_encoding("cl100k_base")
    num_tokens = len(encoding.encode(string))
    return num_tokens

def question(query):
    with get_openai_callback() as cb:
        input = 0
        output = 0
        global question_number
        question_number += 1

        messages = []
        content = query + " Please space the words correctly."
        messages.append({"role" : "user", "content": content})
        completion = openai.ChatCompletion.create(
        temperature = 0,
        model = 'gpt-3.5-turbo-0613',
        messages = messages,
        )
        query = completion.choices[0].message.content

        # query += " translate this question into a natural positive interrogative sentence in English."
        query += " translate this question in English."
        # query += " please rewrite this question naturally in English."
        chat_response = qa_chain_translate(query)
        chat_response1 = chat_response['result']
        problem_check  = "noproblem"
        if chat_response1.startswith('What') or chat_response1.startswith('Where') or chat_response1.startswith('Why') or chat_response1.startswith('How') or chat_response1.startswith('When') or chat_response1.startswith('Who') :
            problem_check = "what"
            test = ""
        if ' you ' in chat_response1 or ' you?' in chat_response1:
            problem_check = "you"  
            test = ""  
        else :
            if  ' not ' in chat_response1 :
                problem_check = "not"
            docs = docsearch1.get_relevant_documents(chat_response1)
            test = qa_chain.run(input_documents=docs, question=chat_response1)

        # input = num_tokens_from_string(content)
        # output = num_tokens_from_string(test)
        # output += llm_response_tf['result']

        last_result = ""
        if test.startswith('Yes') or test.startswith('No') or test == "":
            last_result = test
            if problem_check == "not" :
                if test.startswith('Yes') :
                    last_result = 'No'
                else :  
                    last_result = 'Yes'
        else :
            response = test

            if ('not explicitly' in response or 'not provide' in response or 
            'not information' in response or 'not mention' in response or 
            'no information' in response or 'not mention' in response ):
                if 'but' in response or 'However' in response or 'only' in response:
                    messages = []
                    content =  "Given the information that " + response
                    content += " can we confirm that " + chat_response1
                    content += " please answer 'Probably yes.' or 'Probably no.'." 
                    messages.append({"role" : "user", "content": content})
                    completion = openai.ChatCompletion.create(
                    temperature = 0,
                    model = 'gpt-3.5-turbo-0613',
                    messages = messages,
                    )
                    last_result = completion.choices[0].message.content
            else :
                messages = []
                content =  "Given the information that " + response
                content += " can we confirm that " + chat_response1
                content += " please answer 'Probably yes.' or 'Probably no.'." 
                messages.append({"role" : "user", "content": content})
                completion = openai.ChatCompletion.create(
                temperature = 0,
                model = 'gpt-3.5-turbo-0613',
                messages = messages,
                )
                last_result = completion.choices[0].message.content
                # if 'Yes' in last_result : or 'No' in last_result
        # input += num_tokens_from_string(content)
        # output += num_tokens_from_string(chat_response)

        prompt = chat_response1+ "Translate this question into Korean."

        response = openai.ChatCompletion.create(
            model = 'gpt-3.5-turbo-0613',
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0,
        )

        chat_response3 = response.choices[0].message.content.strip()
        # input += num_tokens_from_string(prompt)
        # output += num_tokens_from_string(chat_response3)
        # token = "input : "+ str(input) + " output : "+ str(output)
        # print("input : ", input , " output : ", output)
        # input += chat_response1['result'] + " Translate this into Korean."
        # output += chat_response3
        global last_date
        new_problem =QuestionLog(date=last_date.day, question=query, question_kr=chat_response1, answer=last_result, answer2=test)
        new_problem.save()
    return chat_response1, last_result, chat_response3, problem_check
    

def submit(answer):
    with get_openai_callback() as cb:
        global question_number
        question_number += 1
        last_result = ""
        answer_origin = answer
        answer += " please rewrite this sentance naturally in English."
        messages = []
        messages.append({"role" : "user", "content": answer})
        completion = openai.ChatCompletion.create(
        temperature = 0,
        model = 'gpt-3.5-turbo-0613',
        messages = messages,
        )
        chat_response1 = completion.choices[0].message.content
        # input += query
        # output += chat_response1['result']

        # if llm_response['result'].startswith('Yes'):
        global problem_en
        global answer_plus
        
        # docs = docsearch1.get_relevant_documents(chat_response1)
        # last_result = qa_chain.run(input_documents=docs, question=chat_response1)
        # print("result_yes_no :", last_result, chat_response1)
        # if last_result.startswith('Yes') or 1 :
            # messages = []
            # content =  "Given the information that " + "'"+answer_plus+"',"
            # content += chat_response1 + " is saying "+keywords[0].alternative_word+"? Answer yes or no." 
            # # content += " Please answer 'yes.' or 'no.' or 'probably.' or 'probably not.'"
            # print(content)
            # messages.append({"role" : "user", "content":content})
            # completion = openai.ChatCompletion.create(
            #     temperature = 0,
            #     model = 'gpt-3.5-turbo-0613',
            #     messages = messages
            #     )
            # last_result = completion.choices[0].message.content
            # for keyword in keywords:
            #     if last_result.startswith('Yes') :
            #         print(3)
            #         prompt = chat_response1 +f" Does this sentence contain the word '{keyword.word}'? Answer yes or no."
            #         completion = openai.ChatCompletion.create(
            #             model = 'gpt-3.5-turbo-0613',
            #             messages=[
                            
            #                 {"role": "user", "content": prompt}
            #             ],
            #             temperature=0,
            #         )
                    
            #         last_result = completion.choices[0].message.content.strip()
            #         print(prompt)
        docs = docsearch1.get_relevant_documents("Is" +keywords[0].alternative_word + " because " + chat_response1 + "?")
        print("Is" +keywords[0].alternative_word + " because " + chat_response1 + "?")
        last_result = qa_chain.run(input_documents=docs, question="Is" +keywords[0].alternative_word + " because " + chat_response1 + "?")
             
        # else :
        #     last_result = "No"

        messages = []
        messages.append({"role" : "user", "content": chat_response1+ " Translate this into Korean."})
        completion = openai.ChatCompletion.create(
        temperature = 0,
        model = 'gpt-3.5-turbo-0613',
        messages = messages
        )
        chat_response3 = completion.choices[0].message.content

        global last_date
        new_problem =QuestionLog(date=last_date.day, question=answer, question_kr=chat_response1,  answer=last_result)
        new_problem.save()
        # print(cb)
    return chat_response1, chat_response3, last_result
    


def get_story():
    korea_timezone = pytz.timezone('Asia/Seoul')
    now = datetime.now(korea_timezone)
    today = now.day-1
    seaturtle = SeaTurtle.objects.filter(date = today)
    global story
    global correct_answer
    correct_answer = seaturtle[0].correct_answer
    global answer_plus
    answer_plus = seaturtle[0].answer_plus

    global problem
    problem = seaturtle[0].problem

    story = seaturtle[0].story
    title = str(today) + ".txt"
    with open(title, 'w') as f:
        f.write(story + '\n')

    # Create a TextLoader instance
    with open(title) as f:
        state_of_the_union = f.read()
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_text(state_of_the_union)

    embeddings = OpenAIEmbeddings()

    global docsearch1
    docsearch1 = Chroma.from_texts(texts, embeddings, metadatas=[{"source": str(i)} for i in range(len(texts))]).as_retriever()

    # Create the QA chain
    global qa_chain
    # qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
    #                                     chain_type="stuff",
    #                                     retriever=docsearch.as_retriever(),
    #                                     return_source_documents=True)
    

    qa_chain = load_qa_chain(turbo_llm, chain_type="stuff")

    
    global keywords
    keywords = Keyword.objects.filter(date = today)

    global hints
    hints = Hint.objects.filter(date = today)

    global n_number
    global start_date
    n_number = (now.date() - start_date).days

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

    title = str(today) + "_problem_en.txt"
    with open(title, 'w') as f:
            f.write(problem_en + '\n')
    loader = TextLoader(title)
    documents = loader.load()
    
    texts = text_splitter.split_documents(documents)
    docsearch = Chroma.from_documents(texts, embeddings)

    global qa_chain_translate
    qa_chain_translate = RetrievalQA.from_chain_type(llm=turbo_llm2,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    
    export_and_delete()
    export_and_delete_Log()
    return 0

def getProblem():
    global last_date
    current_date = datetime.now(pytz.timezone('Asia/Seoul')).date()
    global people_number
    people_number += 1
    global n_number
    if last_date != current_date or n_number == 0:
        get_story()
        print(1)
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
    timezone = pytz.timezone('Asia/Seoul')
    yesterday = datetime.now(timezone) - timedelta(days=1)

    data = SubmitProblem.objects.all()
    filename = 'submit_problem_{}.csv'.format(yesterday.strftime('%Y_%m_%d'))
    file_exists = os.path.isfile(filename)
    
    with open(filename, 'a', newline='') as csvfile:
        fieldnames = ['user', 'problem', 'explanation']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        for obj in data:
            writer.writerow({'user': obj.user, 'problem': obj.problem, 'explanation': obj.explanation})

    data.delete()

def export_and_delete_Log():
    
    timezone = pytz.timezone('Asia/Seoul')
    yesterday = datetime.now(timezone) - timedelta(days=1)

    data = QuestionLog.objects.all()

    filename = 'log_{}.csv'.format(yesterday.strftime('%Y_%m_%d'))
    file_exists = os.path.isfile(filename)
    
    with open(filename, 'a', newline='') as csvfile:
        fieldnames = ['id','date', 'question', 'question_kr', 'answer', 'answer2']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        for obj in data:
            writer.writerow({'id': obj.id,'date': obj.date, 'question': obj.question, "question_kr": obj.question_kr,'answer': obj.answer, 'answer2': obj.answer2})

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
    query += " please rewrite this question naturally in English."
    # messages = []
    # messages.append({"role" : "user", "content": query})
    # completion = openai.ChatCompletion.create(
    #   temperature = 0,
    #   model = 'gpt-3.5-turbo-0613',
    #   messages = messages,
    # )
    # chat_response1 = completion.choices[0].message.content
    chat_response = qa_chain_translate(query)
    chat_response1 = chat_response['result']
    chat_response1 = chat_response1.split("?")[0]+"?"

    messages = []
    messages.append({"role" : "user", "content": chat_response1 + " Translate this question into Korean."})
    completion = openai.ChatCompletion.create(
      temperature = 0,
      model = 'gpt-3.5-turbo-0613',
      messages = messages
    )
    chat_response3 = completion.choices[0].message.content
    return chat_response1, chat_response3

def question_en(query):

    # if query == "Please re-enter the question.":
    #     return "", ""

    # messages = []
    # content =  query + " Please change it into a declarative sentence."
    # messages.append({"role" : "user", "content": content})
    # completion = openai.ChatCompletion.create(
    #   temperature = 0,
    #   model = 'gpt-3.5-turbo-0613',
    #   messages = messages,
    # )
    # chat_response3 = completion.choices[0].message.content

    # gpt4_query = query + " Answer yes or no or probably or probably no"
    # llm_response_tf = qa_chain(gpt4_query)
    docs = docsearch1.get_relevant_documents(query)
    test = qa_chain.run(input_documents=docs, question=query)
    # if llm_response_tf['result'].startswith('Yes') or llm_response_tf['result'].startswith('No') :
    #     llm_response = qa_chain(chat_response3+" tell me why.")
    # else :
    # llm_response = qa_chain(chat_response3+" please imagine this story.")

    # if llm_response_tf['result'].startswith('Yes') or llm_response_tf['result'].startswith('No'):
    #     response = remove_first_word(llm_response_tf['result'])
    # else :
    #     response = llm_response_tf['result']
    last_result = ""
    if test.startswith('Yes') or test.startswith('No'):
        last_result = test
    else :
        response = test

        if ('not explicitly' in response or 'not provide' in response or 
        'not information' in response or 'not mention' in response):
            if 'but' in response or 'However' in response:
                messages = []
                content =  "Given the information that " + response
                content += " can we confirm that " + query
                content += " please answer 'Yes.' or 'No.' or 'Probably yes.' or 'Probably no.'" 
                messages.append({"role" : "user", "content": content})
                completion = openai.ChatCompletion.create(
                temperature = 0,
                model = 'gpt-3.5-turbo-0613',
                messages = messages,
                )
                last_result = completion.choices[0].message.content
        else :
            messages = []
            content =  "Given the information that " + response
            content += " can we confirm that " + query
            content += " please answer 'Yes.' or 'No.' or 'Probably yes.' or 'Probably no.'" 
            messages.append({"role" : "user", "content": content})
            completion = openai.ChatCompletion.create(
            temperature = 0,
            model = 'gpt-3.5-turbo-0613',
            messages = messages,
            )
            last_result = completion.choices[0].message.content
    global last_date
    new_problem =QuestionLog(date=last_date.day, question=query, answer=last_result, answer2=test)
    new_problem.save()

    return last_result, ""