// import fetch from 'node-fetch';

async function test() {
    // Register Employee
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: "Employee User",
            email: "emp@test.com",
            password: "password123",
            employeeId: "EMP001",
            role: "EMPLOYEE"
        })
    });
    console.log("Register Status:", regRes.status);

    // Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: "emp@test.com",
            password: "password123"
        })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login Token:", token ? "Got Token" : "No Token");

    // Apply Leave
    const leaveRes = await fetch('http://localhost:5000/api/leave/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            type: "SICK",
            startDate: "2026-01-01",
            endDate: "2026-01-02",
            remarks: "Sick leave"
        })
    });
    console.log("Leave Apply Status:", leaveRes.status);
    const text = await leaveRes.text();
    try {
        const leaveData = JSON.parse(text);
        console.log("Leave Apply Body:", JSON.stringify(leaveData, null, 2));
    } catch (e) {
        console.log("Leave Apply Response (Text):", text);
    }

    // Get Leaves
    const getRes = await fetch('http://localhost:5000/api/leave/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const leaves = await getRes.json();
    console.log("Leaves Count:", leaves.length);
    console.log("First Leave Status:", leaves[0]?.status);
}

test();
