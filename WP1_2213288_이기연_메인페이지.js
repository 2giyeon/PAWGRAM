    //반려동물 프로필
    function loadProfiles() {
        const profiles = JSON.parse(localStorage.getItem('petProfiles')) || [];
        const Container = document.getElementById('add-profile');
        const Content = document.getElementById('add-profile-content');
        const addProfile = document.getElementById('profile');

        Container.innerHTML = '';

        if (profiles.length > 0) {
            addProfile.style.display = 'none';
        }

        profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            const profileText = document.createElement('div');
            profileCard.className = 'profile';

            const imageSrc = getBreed(profile.type, profile.breed);

            profileCard.innerHTML = `
                <div class="character">
                    <img src="${imageSrc}" alt="${profile.breed}">
                </div>
            `;

            profileText.innerHTML = ` 
                <div class="profile-info">
                    <div class="named">
                    <h3>${profile.name}</h3> <span>${profile.age}살</span> </div>
                    <div>
                    <div class="sub-text">${profile.breed}</div>
                    <div class="meet">만난지 <span>${profile.daysLived}일<span></div>
                    </div>
                </div> 
            `;
            Container.appendChild(profileCard);
            Content.appendChild(profileText);
        });
    }

    //JSON 데이터 불러오기
    fetch('WP1_2213288_이기연_breeds.json')
    .then(response => response.json())
    .then(data => {
        window.breedsData = data;
        loadProfiles(data);
    })
    .catch(error => console.error('JSON 데이터 불러오기 실패:', error));

    //breeds.json 데이터에서 동물 type, 품종에 맞는 이미지 반환
    function getBreed(type, breed) {
        if (!window.breedsData) return 'default.png';
        const breeds = window.breedsData[type];
        if (!breeds) return 'default.png';
        const match = breeds.find(item => item.name === breed);
        return match && match.image ? match.image : 'default.png';
    }
    
    //산책, 식사, 배변 기록의 총 합 계산
    function updateCounts() {
        const records = JSON.parse(localStorage.getItem('petRecords')) || {};
        const counts = { '산책': 0, '식사': 0, '배변': 0 };
        
        Object.values(records).forEach(dayRecords => {
            dayRecords.forEach(record => {
                if (record.type === '산책') {
                    const duration = parseInt(record.duration) || 0
                    counts['산책'] += duration;
                } else if (record.type === '식사') {
                    counts['식사']++;
                } else if (record.type === '배변') {
                    counts['배변']++;
                }
            });
        });
        
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const p = card.querySelector('p');
            if (title.includes('산책')) {
                p.textContent = `${counts['산책']} 분`;
            } else if (title.includes('식사')) {
                p.textContent = `${counts['식사']} 번`;
            } else if (title.includes('배변')) {
                p.textContent = `${counts['배변']} 번`;
            }
        });
    }
    
    //페이지 로드 후 updateCounts를 실행하고 데이터 갱신
    document.addEventListener('DOMContentLoaded', () => {
        updateCounts();
        window.addEventListener('petRecordsUpdated', updateCounts);
        window.addEventListener('focus', updateCounts);
        setInterval(updateCounts, 1000);
    });

    function reset() {
        if (confirm('모든 기록이 삭제됩니다. 정말 초기화하시겠습니까?')) {
            localStorage.removeItem('petRecords');  // localStorage에서 데이터 삭제
            records = {};  // 현재 메모리의 records 객체 초기화
            displayRecords();  // 화면 갱신
            alert('모든 기록이 초기화되었습니다.');
        }
    }

