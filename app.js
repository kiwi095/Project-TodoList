// 달력 관련 변수
let today = new Date();
const calendar = document.querySelector("#calendar");
let nextBtn = document.querySelector(".button-next");
let prevBtn = document.querySelector(".button-prev");
let currentYear = today.getFullYear(); // 현재 연도
let currentMonth = today.getMonth(); // 현재 월(0부터 시작)
let currentDate = today.getDate(); // 현재 날짜
let getCurrentEndDay = new Date(currentYear, currentMonth + 1, 0); // 현재 달의 마지막 날짜 가져오기
let currentEndDate = getCurrentEndDay.getDate(); // 현재 달의 마지막 날짜
let currentEndDay = getCurrentEndDay.getDay(); // 현재 달의 마지막 날짜 요일
let getPrevEndDay = new Date(currentYear, currentMonth, 0); // 이전 달의 마지막 날짜 가져오기
let prevEndDate = getPrevEndDay.getDate(); // 이전 달의 마지막 날짜
let prevEndDay = getPrevEndDay.getDay(); // 이전 달의 마지막 날짜 요일
const dayArr = ["일", "월", "화", "수", "목", "금", "토"];

// todolist 관련 변수
let todoList = document.querySelector("#todolist"); // todolist 공간 가져오기
let addInput = document.querySelector("#add-todo"); // todo 추가 input
let inputForm = document.querySelector("form"); // todo input form
let todoInput = document.querySelector("form input");
let goHome = document.querySelector("#goHome");
let modal = document.querySelector(".modal");
let createNew = document.querySelector("#createNew");

// 달력 코드 시작

// 달력 업데이트 함수(이전, 다음 버튼 클릭시)
function updateMonth() {
  today = new Date(currentYear, currentMonth);
  getCurrentEndDay = new Date(currentYear, currentMonth + 1, 0);
  currentEndDate = getCurrentEndDay.getDate();
  currentEndDay = getCurrentEndDay.getDay();
  getPrevEndDay = new Date(currentYear, currentMonth, 0);
  prevEndDate = getPrevEndDay.getDate();
  prevEndDay = getPrevEndDay.getDay();
}

// 달력 표시 함수
function renderDays() {
  calendar.innerHTML = "";
  const showCurrentMonth = document.querySelector(".currentMonth"); // 현재 년도와 월 표시 위치
  showCurrentMonth.innerHTML = `${today.getFullYear()}년 ${
    // 현재 년도와 월 표시
    today.getMonth() + 1
  }월`;

  // 이전 달의 날짜 렌더링
  for (let i = prevEndDay; i >= 0; i--) {
    const prevDate = document.createElement("div");
    prevDate.innerHTML = prevEndDate - i;
    calendar.appendChild(prevDate);
    prevDate.classList.add("not-current-date"); // 이전 달의 날짜에 스타일 클래스 적용(흐린 색상의 폰트)
  }
  // 현재 달의 날짜 렌더링
  for (let i = 1; i <= currentEndDate; i++) {
    const rederDate = document.createElement("div");
    rederDate.innerHTML = i;
    rederDate.id = `${currentYear}/${currentMonth}/${i}`;
    calendar.appendChild(rederDate);
    // console.dir(rederDate);
  }

  // 다음 달의 날짜 렌더링
  for (let i = 1; i <= 6 - currentEndDay; i++) {
    const nextDate = document.createElement("div");
    nextDate.innerHTML = i;
    calendar.appendChild(nextDate);
    nextDate.classList.add("not-current-date"); // 다음 달의 날짜에 스타일 클래스 적용(흐린 색상의 폰트)
  }
}
renderDays();
let days = document.querySelectorAll("#calendar div"); // 생성한 모든 현재 날짜(1~30or31) 가져오기

// 이전 버튼 클릭 이벤트
prevBtn.addEventListener("click", function () {
  currentMonth--;
  if (currentMonth < 0) {
    currentYear--;
    currentMonth = 11;
  }
  updateMonth();
  renderDays();
});

// 다음 버튼 클릭 이벤트
nextBtn.addEventListener("click", function () {
  currentMonth++;
  if (currentMonth > 11) {
    currentYear++;
    currentMonth = 0;
  }
  updateMonth();
  renderDays();
});

// 달력 코드 끝

let selectedDayId = null;

// modal back 버튼 클릭 이벤트
goHome.addEventListener("click", function () {
  modal.classList.toggle("hidden-hidden");
  createNew.classList.toggle("hidden-hidden");
});

// 날짜 클릭 후 보이는 createNew 버튼 클릭
createNew.addEventListener("click", function () {
  modal.classList.toggle("hidden-hidden");
  createNew.classList.toggle("hidden-hidden");
});

// modal - todolist 코드 부분

// 새 todo 제출 시 이벤트
inputForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let todos = JSON.parse(localStorage.getItem(selectedDayId)) || [];
  let newTodo = { id: Date.now(), text: addInput.value }; // 새 todo 추가( id 부여, 입력된 텍스트 저장)
  todos.push(newTodo);
  localStorage.setItem(selectedDayId, JSON.stringify(todos));
  renderTodoList(todos); // 화면에 todo 추가
  todoInput.value = "";
});

function renderTodoList(todos) {
  todoList.innerHTML = ""; // 기존 리스트 초기화
  todos.forEach((todo) => {
    let todoDiv = document.createElement("div"); // 새로운 Todo div 생성
    let todoText = document.createElement("span"); // 텍스트를 위한 span 생성
    todoText.innerHTML = todo.text; // Todo 텍스트 설정
    todoDiv.appendChild(todoText); // 텍스트를 div에 추가

    // 삭제 버튼 생성
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    todoDiv.appendChild(deleteBtn);

    // 수정 버튼 생성
    let changeBtn = document.createElement("button");
    changeBtn.classList.add("change");
    todoDiv.appendChild(changeBtn);

    // 리스트에 Todo div 추가
    todoList.appendChild(todoDiv);

    // 삭제 버튼 클릭 이벤트
    deleteBtn.addEventListener("click", function () {
      // Todo 삭제 로직
      todos = todos.filter((t) => t.id !== todo.id);
      localStorage.setItem(selectedDayId, JSON.stringify(todos));
      renderTodoList(todos);
    });

    // 수정 버튼 클릭 이벤트
    changeBtn.addEventListener("click", function () {
      let changeInput = document.createElement("input");
      changeInput.value = todo.text;
      todoDiv.prepend(changeInput);
      todoText.classList.toggle("hidden-none");

      changeInput.addEventListener("blur", function () {
        todo.text = changeInput.value;
        localStorage.setItem(selectedDayId, JSON.stringify(todos));
        renderTodoList(todos);
      });
    });
  });
}

// 이전에 클릭된 날짜 요소 저장
let prevSelectedDay = null;

// 각각의 날짜 클릭 시 이벤트
for (let day of days) {
  day.addEventListener("click", function (event) {
    const clickedDay = event.target;
    if (prevSelectedDay) {
      prevSelectedDay.classList.remove("clickedDay");
    }
    clickedDay.classList.add("clickedDay");
    prevSelectedDay = clickedDay;
    selectedDayId = clickedDay.id;
    let todos = JSON.parse(localStorage.getItem(selectedDayId)) || [];
    createNew.classList.remove("hidden-hidden");
    renderTodoList(todos);
  });
}
