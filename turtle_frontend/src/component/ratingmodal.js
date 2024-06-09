import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // 이 부분은 accessibility를 위해 필요합니다.

function RatingModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName="modalOverlay"
      className="modalContent"
      contentLabel="Rating Modal"
    >
      <h2>평점을 입력해주세요</h2>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "filled" : ""}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={() => setIsOpen(false)}>확인</button>
    </Modal>
  );
}

export default RatingModal;
