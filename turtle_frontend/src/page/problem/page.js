import './page.css';
import { useState } from 'react';
import axios from 'axios';


export default function Problem() {
    const [text, setText] = useState(''); // 텍스트 상태를 관리하는 state

    const handleChange = (e) => {
      setText(e.target.value); // 사용자의 입력을 text state에 저장
    }
  
    const handleClick = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/endpoint', { text });
        console.log(response.data); // 응답 확인
      } catch (error) {
        console.error(error);
      }
    }

    return (
    <div className="all">
  <div className="e218_192">
        <input
          className="textbox"
          value={text}
          onChange={handleChange}
        />
      <div className="ei125_118_152_168">
        <button className="send_button" onClick={handleClick}>
          
        </button>
      </div>
  </div>

  <div className="e28_163">
    <div className="e111_301">
      <span  className="nickname">thisis2jun9 님</span>
      <div className="e125_157">
        <div className="profile_photo"></div>
      </div>
    </div>
    <p  className="About">About</p>
    <p  className="QnA">QnA</p>
    <p  className="Log">Log</p>
    <div className="e125_159">
      <div className="ei125_159_144_2659">
      </div>
    </div>
    <span  className="F22F">F22F</span>
  </div>
  <div className="e168_70">
    <span  className="description">텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의 답을 받을 수 있습니다.</span>
<span  className="description_2">N번째 바다거북수프의 정답을 맞혀보세요.</span>
</div>
  <div className="e218_180">
    <div className="e102_77">
      <div className="ei102_77_152_95"></div>
    </div><span  className="Question">여자는 귀가하기 위해 엘리베이터를 타려다가,
자신의 남편이 죽은 것을 깨달았다. 왜 그랬을까?</span>
  </div>
  <div className="e218_179">
    <div className="e186_106"></div>
    <div className="e186_107">
      <div className="ei186_107_5790_3581"></div>
    </div><span  className="e186_108">TOP</span>
  </div>
</div>
    )
}

