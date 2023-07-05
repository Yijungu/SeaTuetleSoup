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

n_number = 1

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

sentences_kr = ["그 할머니는 과거에 국제적으로 유명한 천문학자였습니다. 그녀는 은퇴 후에도 계속해서 연구를 하고 싶은 욕구가 있었고, 마을의 산 정상에서 별을 관측하는 것이 가장 이상적이라는 결론을 내렸습니다. 그런데 문제는 그 산은 마을 사람들에게 신성한 산으로 여겨졌습니다. 이 산은 고대부터 마을을 보호해주는 신이 살고 있다는 전설이 있어, 마을 사람들은 존경의 표시로 산에 오르는 것을 허용하지 않았습니다. 그러나 할머니는 과학 연구를 위해 이 규칙을 어겨야만 했습니다. 그래서 그녀는 밤낚시를 즐기는 이웃집 할머니로 마을 사람들에게 알려지기 위해 낚싯대를 들고 다녔습니다. 그렇게 그 주변에 있는 작은 연못으로 낚시를 가는 척하며 산에 올라갔고, 실제로는 그 '낚싯대'는 별을 가리키는 도구로 사용되었습니다. 이런 식으로 그녀는 별을 관측하고 마을 사람들의 의심을 피하며 자신의 연구를 계속할 수 있었습니다. 이것이 이야기의 진상이었습니다."]

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
k = 1
keywords = []
answer_plus = " 이 글에서 건축가에 대한 이야기가 있어? 길게 설명하지 말고 네 아니오로만 대답해줘"
problem = "매일 밤, 나는 이웃집 할머니가 낚싯대를 들고 나가는 것을 보았다. 하지만 할머니는 한 번도 고기를 잡아오지 않았다. 왜 그랬을까?"
story = "그 할머니는 과거에 국제적으로 유명한 천문학자였습니다. 그녀는 은퇴 후에도 계속해서 연구를 하고 싶은 욕구가 있었고, 마을의 산 정상에서 별을 관측하는 것이 가장 이상적이라는 결론을 내렸습니다. 그런데 문제는 그 산은 마을 사람들에게 신성한 산으로 여겨졌습니다. 이 산은 고대부터 마을을 보호해주는 신이 살고 있다는 전설이 있어, 마을 사람들은 존경의 표시로 산에 오르는 것을 허용하지 않았습니다. 그러나 할머니는 과학 연구를 위해 이 규칙을 어겨야만 했습니다. 그래서 그녀는 밤낚시를 즐기는 이웃집 할머니로 마을 사람들에게 알려지기 위해 낚싯대를 들고 다녔습니다. 그렇게 그 주변에 있는 작은 연못으로 낚시를 가는 척하며 산에 올라갔고, 실제로는 그 '낚싯대'는 별을 가리키는 도구로 사용되었습니다. 이런 식으로 그녀는 별을 관측하고 마을 사람들의 의심을 피하며 자신의 연구를 계속할 수 있었습니다. 이것이 이야기의 진상이었습니다."

def question(query):
    query = "구체적인 설명은 하지말고 꼭 네, 아니오, 모르겠습니다 로만 대답해줘. " + query 
    print(query)
    llm_response = qa_chain(query)
    print(llm_response['result'])
    return llm_response['result']

def submit(answer):
    messages = []
    answer += " 이 글에서 관측, 낚시대, 산이랑 비슷한 단어가 들어가있어? 길게 설명하지 말고 네 아니오로만 대답해줘"
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
    global keywords
    keywords = [keyword.word for keyword in keywords]  # keyword 객체를 keyword.word 문자열로 변환
    keywords_str = ", ".join(keywords)  # keywords 리스트의 각 항목 사이에 쉼표와 공백 삽입
    global answer_plus
    answer_plus = " 이 글에서 " + keywords_str + "이랑 비슷한 단어가 들어가 있어? 길게 설명하지 말고 네 아니오로만 대답해줘"

    return 0

def get_story():
    today = datetime.today().day
    seaturtle = SeaTurtle.objects.filter(date = today)
    global story
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
    global problem
    problem = seaturtle[0].problem
    global keywords
    keywords = list(Keyword.objects.filter(date = today))
    global n_number
    n_number += 1
    answer_plus_edit()
    print(story)
    print(problem)
    print("asdasdas")
    print(getProblem())
    return 0

def getProblem():
    # print(problem)
    return problem

def getStory():
    return story

def getNnumber():
    return n_number

def printgetStory():
    print(story)