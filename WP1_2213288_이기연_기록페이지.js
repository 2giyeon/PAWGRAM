    let records = JSON.parse(localStorage.getItem('petRecords')) || {};
    let selectedDate = new Date().toISOString().split('T')[0];

     // 페이지 로드 시 초기화
    window.onload = () => {
        document.getElementById('recordDate').value = selectedDate;
        display();
    };

    // 날짜 변경
    function changeDate(date) {
        selectedDate = date;
        display();
    }

    // 간편 기록 추가
    function addRecord(type) {
        if (!records[selectedDate]) {
            records[selectedDate] = [];
        }
        records[selectedDate].unshift({
            id: Date.now(),
            type: type,
            time: getCTime(),
            duration: type === '산책' ? '30분' : '',
            memo: '',
        });
        LocalStorage();
        emitEvent();
        display();
    }

    // 기록 저장
    function saveRecord() {
        const activeTab = document.querySelector('.tab-button.active').innerText.trim();
        const record = { id: Date.now(), type: activeTab, time: getCTime(), memo: '' };
        
        if (activeTab === '식사') {
            record.detail = document.querySelector('#tab-식사 .select-btn.active').innerText;
            record.memo = document.getElementById('식사메모').value.trim();
            record.time = document.getElementById('식사시간').value || record.time;
        } else if (activeTab === '산책') {
            record.place = document.getElementById('산책장소').value.trim();
            record.duration = document.querySelector('.time-range input[placeholder="분"]').value + '분';
        } else if (activeTab === '배변') {
            record.detail = document.querySelector('#tab-배변 .select-btn.active').innerText;
            record.memo = document.getElementById('배변메모').value.trim();
            record.time = document.getElementById('배변시간').value || record.time;
        }
        if (!records[selectedDate]) records[selectedDate] = [];
        records[selectedDate].unshift(record);

        LocalStorage();
        emitEvent();
        display();
        closeModal();
        }

    // 새 기록 추가 후 화면 표시
    function display() {
        const recordList = document.getElementById('recordList');
        recordList.innerHTML = '';
        
        const dayRecords = records[selectedDate] || [];
        if (dayRecords.length === 0) {
        document.getElementById('emptyState').style.display = 'flex';} 
        else {
            document.getElementById('emptyState').style.display = 'none';
            dayRecords.forEach(record => {
                const li = document.createElement('li');
                li.className = 'record-item';
                let detailInfo = '';
                
                if (record.type === '산책') {
                    detailInfo = `${record.duration || '30분'} | ${record.place || ''}`;
                } else if (record.type === '식사') {
                    detailInfo = `${record.detail || '사료'} | ${record.memo ||''}`;
                } else if (record.type === '배변') {
                    detailInfo = `${record.detail || '소변'} | ${record.memo || ''}`;
                }
                    li.innerHTML = `
                    <img src="${getEmoji(record.type)}" alt="${record.type}" class="record-icon">
                    <div>
                        <h3>${record.time} ${record.type}</h3>
                        <p>${detailInfo}</p>    
                    </div>
                    <button class="delete-btn" onclick="deleteRecord(${record.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                recordList.appendChild(li);
            });
        }
    }

    // 기록 삭제
    function deleteRecord(recordId) {
        records[selectedDate] = records[selectedDate].filter(r => r.id !== recordId);
        LocalStorage();
        display();
    }

    // 모달 열기/닫기
    function openModal() {
        document.getElementById('logModal').style.display = 'flex';
        selectTab('식사');
    }

    function closeModal() {
        document.getElementById('logModal').style.display = 'none';
    }

    // 식사, 산책, 배변 탭 이동
    function selectTab(tab) {
        document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        document.getElementById(`tab-${tab}`).style.display = 'block';
        event.target.classList.add('active');
    }

    // 버튼 활성화 상태 변경
    function active(button) {
        button.parentElement.querySelectorAll('.select-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }


    //이모티콘? 반환
    function getEmoji(type) {
        switch (type) {
            case '산책': return "2213288_1.png";
            case '식사': return "2213288_2.png";
            case '배변': return "2213288_3.png";
            default: return "2213288_1.png";
        }
    }

    function getCTime() {
        const now = new Date();
        const H = now.getHours();
        const M = now.getMinutes();
        return `${H}:${M}`
    }

    // 로컬스토리지에 데이터 저장
    function LocalStorage() {
        localStorage.setItem('petRecords', JSON.stringify(records));
        emitEvent();
    }

    //커스텀 이벤트를 생성하여 브라우저에 전달달
    function emitEvent() {
        const event = new Event('petRecordsUpdated');
        window.dispatchEvent(event);
}

function reset() {
    if (confirm('모든 기록이 삭제됩니다. 정말 초기화하시겠습니까?')) {
        localStorage.removeItem('petRecords');  // localStorage에서 데이터 삭제
        records = {};  // 현재 메모리의 records 객체 초기화
        displayRecords();  // 화면 갱신
        alert('모든 기록이 초기화되었습니다.');
    }
}
