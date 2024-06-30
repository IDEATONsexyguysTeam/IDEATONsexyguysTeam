import React, { useState } from 'react';
import './App.css'; // CSS 파일 import
import logo from './logo.png'; // 이미지 파일 import

function App() {
  const [activeMenu, setActiveMenu] = useState('홈');
  const [modalOpen, setModalOpen] = useState(false); // 모달 열기/닫기 상태 관리

  const handleMenuClick = (menu) => {
    if (!modalOpen) { // 모달이 열려있는 동안은 메뉴 클릭을 무시
      setActiveMenu(menu);
      if (menu === '홈') {
         // 홈 메뉴 클릭 시 모달 열기 아님x
      } else {
        closeModal(); // 다른 메뉴 클릭 시 모달 닫기
      }
    }
  };

  const openModal = () => {
    setModalOpen(true);
    // 모달이 열렸을 때 body에 스타일을 추가하여 스크롤을 막습니다.
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    // 모달이 닫혔을 때 body의 스타일을 초기화하여 스크롤을 다시 허용합니다.
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="container">
      <header className="header">
        <img src={logo} className="logo" alt="Logo" />
        <h1>하루한번 뇌운동</h1>
      </header>
      <div className="menu">
        <div
          className={`menu-item ${activeMenu === '홈' ? 'active' : ''}`}
          onClick={() => handleMenuClick('홈')}
        >
          홈
        </div>
        <div
          className={`menu-item ${activeMenu === '구매' ? 'active' : ''}`}
          onClick={() => handleMenuClick('구매')}
        >
          구매
        </div>
        <div
          className={`menu-item ${activeMenu === '내정보' ? 'active' : ''}`}
          onClick={() => handleMenuClick('내정보')}
        >
          내정보
        </div>
      </div>
      <div className="content">
        {/* 조건부 렌더링 */}
        {activeMenu === '홈' && <HomeContent openModal={openModal} />}
        {activeMenu === '구매' && <PurchaseContent closeModal={closeModal} />}
        {activeMenu === '내정보' && <UserInfoContent closeModal={closeModal} />}
      </div>
      {/* 모달 */}
      {modalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}

// 홈 콘텐츠 컴포넌트
function HomeContent({ openModal }) {
  return (
    <div className="game-container">
      <div className="game-item larger" onClick={openModal}>
        스트레칭
      </div>
      <div className="game-item larger" onClick={openModal}>
        기억력
      </div>
      <div className="game-item larger" onClick={openModal}>
        집중력
      </div>
      <div className="game-item larger" onClick={openModal}>
        사고력
      </div>
      <div className="game-item larger" onClick={openModal}>
        언어력
      </div>
    </div>
  );
}

// 구매 콘텐츠 컴포넌트
function PurchaseContent({ closeModal }) {
  return (
    <div className="product-container">
      <div className="product-item larger" onClick={closeModal}>
        홍삼
      </div>
      <div className="product-item larger" onClick={closeModal}>
        호박
      </div>
      <div className="product-item larger" onClick={closeModal}>
        콩 세트
      </div>
    </div>
  );
}

// 내정보 콘텐츠 컴포넌트
function UserInfoContent({ closeModal }) {
  return (
    <div className="user-info">
      <input type="text" placeholder="아이디 입력" />
      <input type="password" placeholder="비밀번호 입력" />
      <button className="login-button" onClick={closeModal}>
        로그인
      </button>
    </div>
  );
}

// 모달 컴포넌트
function Modal({ closeModal }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-header">
          <h2>모달 제목</h2>
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-content">
          <p>모달 내용...</p>
        </div>
      </div>
    </div>
  );
}

export default App;