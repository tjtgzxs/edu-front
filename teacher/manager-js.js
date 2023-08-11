document.addEventListener('DOMContentLoaded', () => {
    const teacherList = document.getElementById('teacher-list');
    const studentList = document.getElementById('student-list');
    const schoolSelect = document.getElementById('school-select');
    const newTeacherBtn = document.getElementById('new-teacher-btn');
    const newStudentBtn = document.getElementById('new-student-btn');
    const modal = document.getElementById('myModal');
    const inputForm = document.getElementById('input-form');
    const modalClose = document.getElementsByClassName('close')[0];
    const socket = new WebSocket(localStorage.getItem('ws_url')+'api/websocket'); // Replace with your WebSocket URL

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        inputForm.reset();
        inputForm.removeAttribute('data-user-type'); // Clear user type
    }

    function loadSchools() {
        fetch(localStorage.getItem('base_url')+'api/teachers/schools',{
            method: 'GET', // Or 'PUT' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  localStorage.getItem('token'),
                'X-Requested-With': 'XMLHttpRequest'
            },
        }) // Change this URL to your backend API
            .then(response => response.json())
            .then(schools => {
                schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id; // Change this to your school identifier
                    option.textContent = school.name;
                    schoolSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading schools:', error));
    }

    function loadTeachersBySchool(school) {
        fetch(localStorage.getItem('base_url')+`api/teachers/teachers?school_id=${school}`,{
            method: 'GET', // Or 'PUT' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  localStorage.getItem('token'),
                'X-Requested-With': 'XMLHttpRequest'
            },
        }) // Change this URL to your backend API
            .then(response => response.json())
            .then(teachers => {
                teacherList.innerHTML = teachers.map(teacher => `<li class="teacher-item">${teacher.name}</li>`).join('');
            })
            .catch(error => console.error('Error loading teachers:', error));
    }

    function loadStudentsBySchool(school) {
        fetch(localStorage.getItem('base_url')+`api/teachers/students?school_id=${school}`,{
            method: 'GET', // Or 'PUT' depending on your API
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  localStorage.getItem('token'),
                'X-Requested-With': 'XMLHttpRequest'
            },
        }) // Change this URL to your backend API
            .then(response => response.json())
            .then(students => {
                studentList.innerHTML = students.map(student => `
          <li class="student-item">${student.name} <button id="openChatModalBtn" class="chat-btn" data-student-id="${student.id}">聊天</button></li>
        `).join('');

                const chatButtons = document.querySelectorAll('.chat-btn');
                chatButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const studentId = button.getAttribute('data-student-id');
                        message=prompt("请输入您要发送的消息","");
                        fetch(localStorage.getItem('base_url')+`api/teachers/chat`,{
                            method: 'POST', // Or 'PUT' depending on your API
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization':  localStorage.getItem('token'),
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: JSON.stringify({
                                'targetStudentId': studentId,
                                'message': message
                            })
                        }).then(response => response.json())
                            .then(()=>{
                                alert("发送成功")
                            });


                    });
                });
            })
            .catch(error => console.error('Error loading students:', error));
    }

    schoolSelect.addEventListener('change', () => {
        const selectedSchool = schoolSelect.value;
        loadTeachersBySchool(selectedSchool);
        loadStudentsBySchool(selectedSchool);
    });

    newTeacherBtn.addEventListener('click', () => {
        inputForm.classList.remove('hidden');
        inputForm.setAttribute('data-user-type', 'teacher'); // Set user type
        openModal();
    });

    newStudentBtn.addEventListener('click', () => {
        inputForm.classList.remove('hidden');
        inputForm.setAttribute('data-user-type', 'student'); // Set user type
        openModal();
    });

    modalClose.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input1 = document.getElementById('input1').value;
        const input2 = document.getElementById('input2').value;
        const selectedSchool = schoolSelect.value;
        const userType = inputForm.getAttribute('data-user-type');
        if (selectedSchool === '0') {
            alert('请选择学校');
            return;
        }
        if (input1 && input2 && selectedSchool && userType) {
            const data = {
                school_id: selectedSchool,
                password: input2
            };
            if (userType === 'teacher') {
                data.email = input1;
                data.role="2";
                data.status="1";
                url=localStorage.getItem('base_url')+'/api/teachers/create_teacher';
            }else if (userType === 'student') {
                data.account = input1;
                url=localStorage.getItem('base_url')+'/api/teachers/create_student';
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  localStorage.getItem('token'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    // Handle the response from the backend
                    console.log('提交成功：', result);
                    closeModal();
                    if (userType === 'teacher') {
                        loadTeachersBySchool(selectedSchool);
                    } else if (userType === 'student') {
                        loadStudentsBySchool(selectedSchool);
                    }
                })
                .catch(error => {
                    console.error('提交失败：', error);
                });
        }
    });



    loadSchools();
});
