class Calendar {

  constructor() {
    this.date = new Date();
    this.targetDate = new Date('2025-11-08');
    this.weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    this.videosData = {};
    
    this.init();
  }

  async init() {
    await this.loadVideosData();
    this.renderCalendar();
    this.addEventListeners();
  }

  async loadVideosData() {
    try {
      const response = await fetch('/videos.json');
      this.videosData = await response.json();
    } catch (error) {
      console.error('Failed to load videos data:', error);
      this.videosData = {};
    }
  }

  renderCalendar() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    
    // Update month display
    document.getElementById('currentMonth').textContent = 
      `${year}년 ${month + 1}월`;

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Add weekday headers
    this.weekdays.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-weekday';
      dayElement.textContent = day;
      calendar.appendChild(dayElement);
    });

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add padding for days from previous month
    const padding = firstDay.getDay();
    for (let i = 0; i < padding; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day other-month';
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      dayElement.textContent = prevMonthLastDay - padding + i + 1;
      calendar.appendChild(dayElement);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;

      // Check if it's today
      const currentDate = new Date();
      if (year === currentDate.getFullYear() && 
          month === currentDate.getMonth() && 
          day === currentDate.getDate()) {
        dayElement.classList.add('today');
      }

      // Check if it's target date
      if (year === this.targetDate.getFullYear() && 
          month === this.targetDate.getMonth() && 
          day === this.targetDate.getDate()) {
        dayElement.classList.add('target-date');
      }

      // Check if this date has videos
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (this.videosData[dateString]) {
        dayElement.classList.add('secret-date');
        dayElement.style.cursor = 'pointer';
        dayElement.title = '클릭하여 영상 보기';
        
        dayElement.addEventListener('click', () => {
          // Remove any existing video list
          const existingList = document.querySelector('.video-list');
          if (existingList) {
            existingList.remove();
          }

          // Create and add new video list
          const videoList = document.createElement('div');
          videoList.className = 'video-list';
          videoList.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
          `;

          // Add videos for this date
          this.videosData[dateString].forEach(video => {
            const videoLink = document.createElement('a');
            videoLink.href = video.url;
            videoLink.target = '_blank';
            videoLink.textContent = video.text;
            videoLink.style.cssText = `
              color: #0066cc;
              text-decoration: none;
              display: block;
              padding: 10px;
              transition: background-color 0.2s;
            `;

            videoLink.addEventListener('mouseover', () => {
              videoLink.style.backgroundColor = '#f0f0f0';
            });

            videoLink.addEventListener('mouseout', () => {
              videoLink.style.backgroundColor = 'transparent';
            });

            videoList.appendChild(videoLink);
          });

          document.body.appendChild(videoList);
        });
      }

      calendar.appendChild(dayElement);
    }
  }

  addEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
      this.date.setMonth(this.date.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      this.date.setMonth(this.date.getMonth() + 1);
      this.renderCalendar();
    });
  }
}

// Initialize calendar
(async () => {
  new Calendar();
})();

function updateDday() {
  const targetDate = new Date('2025-11-08');
  const today = new Date();
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const ddayElement = document.getElementById('ddayCount');
  ddayElement.textContent = `D-${diffDays}`;
}

// Initial update
updateDday();

// Update every day
setInterval(updateDday, 1000 * 60 * 60 * 24); 