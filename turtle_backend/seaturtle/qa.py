from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import openai
from .models import SeaTurtle, Keyword
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv() 
openai_apikey = os.getenv('API_KEY')
os.environ["OPENAI_API_KEY"] = openai_apikey
openai.api_key = openai_apikey

turbo_llm = ChatOpenAI(
    temperature=0,
    model_name='gpt-3.5-turbo'
)
embeddings = OpenAIEmbeddings(openai_api_key=openai_apikey)
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

sentences_kr = ["이 남자는 세계적으로 유명한 건축가의 열렬한 팬이었다. 그의 흥분의 원천은 바로 새로운 미술관이 그 건축가의 작품 중 하나였기 때문이었다. 그는 건축물의 완성보다는 그 건축 과정을 지켜보는 것에 더 큰 즐거움을 느꼈다. 따라서 건축이 진행되는 동안 그는 건축 현장 주변을 둘러보며, 그 과정을 즐겼다. 완성된 미술관을 방문하는 것은 그에게는 '건축의 종결'을 의미했고, 그것은 그에게 즐거움보다는 약간의 아쉬움을 가져다주었다. 그래서 미술관이 개장한 후에도 그는 그곳을 방문하지 않았다. 그의 기쁨은 미술관이 완성되는 과정에서 온 것이었고, 그 과정이 종료되면 그의 관심도 함께 끝났다. 그렇기 때문에 미술관이 개장한 후에는 방문할 이유가 없었던 것이다."]

with open('1.txt', 'w') as f:
    for sentence in sentences_kr:
        f.write(sentence + '\n')
loader = TextLoader("1.txt")
documents = loader.load()
texts = text_splitter.split_documents(documents)
docsearch = Chroma.from_documents(texts, embeddings)
qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                    chain_type="stuff",
                    retriever=docsearch.as_retriever(),
                    return_source_documents=True)
keywords = []
answer_plus = " 이 글에서 건축가에 대한 이야기가 있어? 길게 설명하지 말고 네 아니오로만 대답해줘"
problem = "한 남자가 소문으로 새로운 미술관이 곧 오픈한다는 소식을 들었다. 그 날을 앞두고 그는 깊은 기쁨을 느꼈다. 그런데 그는 미술관이 오픈하고도 미술품을 구경하러 한번도 가지 않았다. 왜 그랬을까?"
story = "이 남자는 세계적으로 유명한 건축가의 열렬한 팬이었다. 그의 흥분의 원천은 바로 새로운 미술관이 그 건축가의 작품 중 하나였기 때문이었다. 그는 건축물의 완성보다는 그 건축 과정을 지켜보는 것에 더 큰 즐거움을 느꼈다. 따라서 건축이 진행되는 동안 그는 건축 현장 주변을 둘러보며, 그 과정을 즐겼다. 완성된 미술관을 방문하는 것은 그에게는 '건축의 종결'을 의미했고, 그것은 그에게 즐거움보다는 약간의 아쉬움을 가져다주었다. 그래서 미술관이 개장한 후에도 그는 그곳을 방문하지 않았다. 그의 기쁨은 미술관이 완성되는 과정에서 온 것이었고, 그 과정이 종료되면 그의 관심도 함께 끝났다. 그렇기 때문에 미술관이 개장한 후에는 방문할 이유가 없었던 것이다."

def question(query):
    query += " 부연설명은 하지말고 네 아니오로만 대답해. 모르면 추촌해보고 그래도 모르겠으면 모르겠습니다 라고만해."
    llm_response = qa_chain(query)
    return llm_response['result']

def submit(answer):
    messages = []
    answer += " 이 글에서 건축가 와 비슷한 단어가 들어가있어? 길게 설명하지 말고 네 아니오로만 대답해줘"
    messages.append({"role" : "user", "content": answer})
    completion = openai.ChatCompletion.create(
      model = "gpt-3.5-turbo",
      messages = messages
    )

    chat_response = completion.choices[0].message.content
    print(messages)
    print(chat_response)
    return chat_response

def answer_plus_edit():
    answer_plus = " 이 글에서 "
    for keyword in keywords:
        answer_plus += keyword
        answer_plus += " "
    answer_plus += "와 비슷한 단어가 들어가 있어? 길게 설명하지 말고 네 아니오로만 대답해줘"
    return 0

def get_story():
    today = datetime.today().day
    seaturtle = SeaTurtle.objects.filter(date = today)
    story = [seaturtle[0].story]
    title = str(today) + ".txt"
    with open(title, 'w') as f:
        for sentence in story:
            f.write(sentence + '\n')
    loader = TextLoader(title)
    documents = loader.load()
    texts = text_splitter.split_documents(documents)
    docsearch = Chroma.from_documents(texts, embeddings)
    qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm,
                                  chain_type="stuff",
                                  retriever=docsearch.as_retriever(),
                                  return_source_documents=True)
    problem = seaturtle[0].problem
    keywords = list(Keyword.objects.filter(date = today))
    
    answer_plus_edit()

    return 0

def getProblem():
    return problem

def getStory():
    return story