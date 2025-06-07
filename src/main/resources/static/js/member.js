document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8080/api/members'; 

    const memberForm = document.getElementById('memberForm');
    const memberIdInput = document.getElementById('memberId');
    const memberNameInput = document.getElementById('memberName');
    const memberEmailInput = document.getElementById('memberEmail');
    const memberAddressInput = document.getElementById('memberAddress');
    const memberPhoneNumberInput = document.getElementById('memberPhoneNumber');
    const submitMemberBtn = document.getElementById('submitBtn');
    const cancelMemberUpdateBtn = document.getElementById('cancelUpdateBtn');
    const memberTableBody = document.querySelector('#memberTable tbody');

    let isUpdateMode = false;

    
    async function fetchMembers() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error('Error fetching members:', error);
            alert('Failed to load members. Please check server connection.');
        }
    }

    
    function displayMembers(members) {
        memberTableBody.innerHTML = ''; 
        members.forEach(member => {
            const row = memberTableBody.insertRow();
            row.dataset.memberId = member.id; 

            row.insertCell(0).textContent = member.id;
            row.insertCell(1).textContent = member.name;
            row.insertCell(2).textContent = member.email;
            row.insertCell(3).textContent = member.phoneNumber || '-';
            row.insertCell(4).textContent = member.address || '-';

            const actionsCell = row.insertCell(5);
            actionsCell.classList.add('action-buttons');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => editMember(member.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteMember(member.id));

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    
    memberForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const memberData = {
            name: memberNameInput.value,
            email: memberEmailInput.value,
            address: memberAddressInput.value,
            phoneNumber: memberPhoneNumberInput.value
        };

        try {
            let response;
            if (isUpdateMode) {
                const memberId = memberIdInput.value;
                response = await fetch(`${API_BASE_URL}/${memberId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memberData)
                });
            } else {
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memberData)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Operation failed: ${response.status} - ${errorText}`);
            }

            memberForm.reset();
            isUpdateMode = false;
            submitMemberBtn.textContent = 'Add Member';
            cancelMemberUpdateBtn.style.display = 'none';
            fetchMembers();
            alert(`Member ${isUpdateMode ? 'updated' : 'added'} successfully!`);

        } catch (error) {
            console.error('Error saving member:', error);
            alert('Failed to save member: ' + error.message);
        }
    });

    
    async function editMember(memberId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${memberId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const member = await response.json();

            memberIdInput.value = member.id;
            memberNameInput.value = member.name;
            memberEmailInput.value = member.email;
            memberAddressInput.value = member.address || '';
            memberPhoneNumberInput.value = member.phoneNumber || '';

            isUpdateMode = true;
            submitMemberBtn.textContent = 'Update Member';
            cancelMemberUpdateBtn.style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching member for edit:', error);
            alert('Failed to load member for editing.');
        }
    }

    
    async function deleteMember(memberId) {
        if (!confirm('Are you sure you want to delete this member?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${memberId}`, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                alert('Member deleted successfully!');
                fetchMembers();
            } else if (response.status === 404) {
                alert('Member not found.');
            } else {
                const errorText = await response.text();
                throw new Error(`Delete failed: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Failed to delete member: ' + error.message);
        }
    }

    
    cancelMemberUpdateBtn.addEventListener('click', () => {
        memberForm.reset();
        isUpdateMode = false;
        submitMemberBtn.textContent = 'Add Member';
        cancelMemberUpdateBtn.style.display = 'none';
        memberIdInput.value = '';
    });

    
    fetchMembers();
});