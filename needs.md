## 요구사항
   ### 1. 사용자 관리
   - 로그인(OAuth)
   - app 정보: 포인트, 구매이력, 출석횟수
   ### 2. 게임
   - game session: 게임 진행도(clear 게임 개수), 도전횟수
   ### 3. 스토어
   - 스토어: 전체 포인트, 구매이력, 구매가능 상품
   - 구매 처리 기능
   ### 4. 보안
   - 사용자 인증 & 권한 관리
     - access token: 이름, 이메일
   ### 5. 기타
   - 일일 리셋: 게임 진행도, 도전 횟수

---
## 데이터 모델링
  ### 1. 사용 모델
  - MySQL
  ### 2. 저장 DB
  - 개인 정보: 이름, userId, 구매이력, 포인트
  - 게임 정보(리셋 정보): userId, 게임 진행도, 도전횟수

---
## API
  ### 1. 사용자
  - 사용자 추가: post /users
    - request body: userId
  - 로그인: post /users/login
  - 탈퇴: delete /users
    - request body: userId
  - 구매이력 추가: post /users/items
    - token: user info 
    - request body: itemId
  ### 2. 게임
  - 게임 진행도: get /games
    - response body: level
  - 게임 진행도 설정 & 포인트 추가: post /games
    - token: user info
    - request body: gameId, isClear
  ### 3. 구매
  - 상품 목록: get /items
    - list로 상품명, 가격 받기
    - response body: [{itemId, name, price}]
  - 구매 진행: post /items
    - token: user info
    - request body: itemId

---
## 추가 사항
(추후)
