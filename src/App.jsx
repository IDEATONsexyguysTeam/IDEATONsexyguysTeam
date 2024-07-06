import React, { useState, useEffect } from 'react';
import './App.css'; // CSS 파일 import
import logo from './logo.png'; // 이미지 파일 import
import neckImage from './neck.jpg'; // 이미지 파일 
import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';
import img4 from './4.png';
import imgBack from './5.png'; // 카드 뒷면 이미지 파일
import googleIcon from './google.png'; // 구글 아이콘 이미지 import
import axios from 'axios'; // Axios import

function App() {
  const [activeMenu, setActiveMenu] = useState('홈');
  const [userName, setUserName] = useState("");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };
  useEffect(() => {
    // Fetching data from API on component mount
    axios.get('/api/users')
        .then(response => {
          setUserName(response.data.name); // Assuming API returns an array of items [{ item_name, price, quantity }]
        })
        .catch(error => {
          console.error('Error fetching items from API:', error);
        });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img src={logo} className="logo" alt="Logo" />
        <h1>하루한번 뇌운동</h1>
      </header>
      <span>어서오세요 {userName}님! </span>
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
        {activeMenu === '홈' && <HomeContent />}
        {activeMenu === '구매' && <PurchaseContent />}
        {activeMenu === '내정보' && <UserInfoContent />}
      </div>
    </div>
  );
}

// 홈 콘텐츠 컴포넌트
function HomeContent() {
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', content: null });

  const openModal = (title, content) => {
    setModalInfo({ isOpen: true, title, content });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: '', content: null });
    document.body.style.overflow = 'auto';
  };

  const StretchingContent = () => (
    <div>
      <img src={neckImage} alt="Neck Stretch" className="stretch-image" />
      <button className="next-button" onClick={closeModal}>다음</button>
    </div>
  );

  const MemoryGameContent = () => <MemoryGame handleComplete={handleGameComplete} />;

  const ConcentrationGameContent = () => <ConcentrationGame handleComplete={handleGameComplete} />;
  
  const handleGameComplete = ({level, isClear}) => {
      const postData = { level: level, isClear: isClear };


    console.log(postData.isClear, postData.level);
    axios.post('/api/games', postData)
      .then(response => {
        console.log('게임 완료 정보를 서버에 전송했습니다.');
      })
      .catch(error => {
        console.error('게임 완료 정보를 서버에 전송하는 중 오류가 발생했습니다:', postData);
      });
  };

  return (
    <div className="game-container">
      <div className="game-item larger" onClick={() => openModal('스트레칭', <StretchingContent />)}>
        스트레칭
      </div>
      <div className="game-item larger" onClick={() => openModal('카드 기억력', <MemoryGameContent />)}>
        기억력
      </div>
      <div className="game-item larger" onClick={() => openModal('카드 집중력', <ConcentrationGameContent />)}>
        집중력
      </div>
      <div className="game-item larger" onClick={() => openModal('사고력', '사고력 내용')}>
        사고력
      </div>
      <div className="game-item larger" onClick={() => openModal('언어력', '언어력 내용')}>
        언어력
      </div>
      {modalInfo.isOpen && <Modal title={modalInfo.title} content={modalInfo.content} closeModal={closeModal} />}
    </div>
  );
}

//구매
function PurchaseContent() {
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', content: '' });
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");

  useEffect(() => {
    // Fetching data from API on component mount
    axios.get('/api/items')
      .then(response => {
        setItems(response.data); // Assuming API returns an array of items [{ item_name, price, quantity }]
      })
      .catch(error => {
        console.error('Error fetching items from API:', error);
      });
  }, []);

  const openModal = (itemName, price, quantity) => {
    const content = `${itemName} 구매 정보\n가격: ${price}원\n수량: ${quantity}`;
    setItem(itemName);
    setModalInfo({ isOpen: true, title: itemName, content });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: '', content: '' });
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="product-container">
      {items.map((item, index) => (
        <div key={index} className="product-item larger" onClick={() => openModal(item.itemName, item.price, item.quantity)}>
          {item.itemName}
        </div>
      ))}
      {modalInfo.isOpen && (
        <Pmodal itemName={item} content={modalInfo.content} closeModal={closeModal} />
      )}
    </div>
  );
}

// 내정보 콘텐츠 컴포넌트
function UserInfoContent() {
  const [user, setUser] = useState();
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    // Fetching data from API on component mount
    axios.get('/api/users')
        .then(response => {
          console.log(response.data);
          setUser(response.data); // Assuming API returns an array of items [{ item_name, price, quantity }]
        })
        .catch(error => {
          console.error('Error fetching items from API:', error);
        });

    axios.get('/api/users/items')
        .then(response => {
          setUserItems(response.data);
        })
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
      <div className="user-info">
        {!user ? (
            <button className="login-button google" onClick={handleGoogleLogin}>
              <img src={googleIcon} alt="Google Icon" className="google-icon" />
              <span className="button-text">구글로 로그인</span>
            </button>
        ) : (
            <div>
              <h2>{user.name}님 안녕하세요!</h2>
              <h3>총 포인트: {user.points}</h3>
              <h3>오늘 완료한 레벨: {user.level}</h3>
              <h3>{userItems.map((item) => (
                  <div key={item.id}>
                    {item.itemName} <span style={{color: 'gray', fontSize: 'small'}}>{item.buytime}</span>                  </div>
              ))}</h3>
            </div>
        )}
      </div>
  );
}

// 모달 컴포넌트
function Modal({ title, content, closeModal }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-content">
          {content}
        </div>
      </div>
    </div>
  );
}
//구매 모달 컴포넌트
const Pmodal = ({ id, itemName, content, closeModal }) => {

  const handlePurchase = () => {
    axios.post('/api/items', {
      id: 0,
      itemName:itemName,
      price:0,
      quantity: 0,
      itemImg: ""})
      .then(response => {
        alert(`${itemName}를 구매하였습니다!`);
        console.log('구매 요청 성공:', response.data);
      })
      .catch(error => {
        console.error('구매 요청 중 오류 발생:', error);
      });
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-header">
          <h2>{itemName}</h2>
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-content">
          <p>{content}</p>
          <button className="purchase-button" onClick={handlePurchase}>구매</button>
        </div>
      </div>
    </div>
  );
};

// 카드 짝 맞추기 게임 컴포넌트
function MemoryGame({ handleComplete }) {
  const images = [img1, img2, img3, img4];
  const [cards, setCards] = useState(shuffleArray([...images, ...images]));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [cardsMatchedCount, setCardsMatchedCount] = useState(0);

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(cards[index])) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards([...matchedCards, cards[firstIndex]]);
        setCardsMatchedCount(cardsMatchedCount + 2);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  useEffect(() => {
    if (cardsMatchedCount === 8) {
      handleComplete({ level: 2, isClear: true });
      alert('카드가 모두 맞춰졌습니다!');
    }
  }, [cardsMatchedCount]);

  return (
    <div className="memory-game">
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flippedCards.includes(index) || matchedCards.includes(card) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(card) ? (
              <img src={card} alt="card" className="card-image" />
            ) : (
              <img src={imgBack} alt="card back" className="card-image" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

//집중력게임 컴포넌트
function ConcentrationGame({handleComplete}) {
  const [cards, setCards] = useState([
    { id: 1, number: 1, isFlipped: false }, // 각 카드는 숫자와 뒤집힌 상태를 가짐
    { id: 2, number: 2, isFlipped: false },
    { id: 3, number: 3, isFlipped: false },
    { id: 4, number: 4, isFlipped: false },
    { id: 5, number: 5, isFlipped: false },
    { id: 6, number: 6, isFlipped: false },
    { id: 7, number: 7, isFlipped: false },
    { id: 8, number: 8, isFlipped: false },
  ]);

  const [flippedCount, setFlippedCount] = useState(0); // 뒤집힌 카드 수를 추적
  const [correctSequence, setCorrectSequence] = useState(1); // 올바른 순서를 추적

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 카드 순서를 랜덤으로 섞음
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    // Fisher-Yates shuffle 알고리즘을 이용하여 카드 순서를 랜덤으로 섞음
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    setCards(shuffledCards);
  };

  const handleCardClick = (clickedCard) => {
    if (clickedCard.number === correctSequence) { // 올바른 순서의 카드를 클릭한 경우
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === clickedCard.id ? { ...card, isFlipped: true } : card
        )
      );
      setCorrectSequence(prevSequence => prevSequence + 1); // 다음 올바른 순서로 업데이트
      setFlippedCount(prevCount => prevCount + 1); // 뒤집힌 카드 수 증가

      // 모든 카드를 맞췄을 때
      if (correctSequence === 8) {
        handleComplete({ level: 3, isClear: true });
        alert('모든 카드를 맞추셨습니다!');
        shuffleCards(); // 새로운 게임을 위해 카드 다시 섞기
        setCorrectSequence(1); // 올바른 순서 초기화
        setFlippedCount(0); // 뒤집힌 카드 수 초기화
      }
    } else {
      // 잘못된 순서로 클릭한 경우, 게임을 초기 상태로 되돌림
      setCards(cards.map(card => ({ ...card, isFlipped: false })));
      setCorrectSequence(1);
      setFlippedCount(0);
      shuffleCards(); // 카드를 다시 섞음
    }
  };

  return (
    <div className="concentration-game">
      <div className="cards-container">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            {card.isFlipped ? 'V' : card.number}
          </div>
        ))}
      </div>
      {flippedCount === 8 && <p>모든 카드를 맞췄습니다!</p>}
    </div>
  );
}

export default App;