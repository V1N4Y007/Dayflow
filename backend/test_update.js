// import fetch from 'node-fetch';

async function test() {
    // Login first to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: "admin@test.com",
            password: "password123"
        })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    const userId = loginData.user.id;

    console.log("Login Token:", token ? "Got Token" : "No Token");

    // Update User
    const updateRes = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            phone: "9999999999"
        })
    });
    const updateData = await updateRes.json();
    console.log("Update Status:", updateRes.status);
    console.log("Update Body:", JSON.stringify(updateData, null, 2));

    // Fetch User to verify
    const getRes = await fetch('http://localhost:5000/api/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const users = await getRes.json();
    const updatedUser = users.find(u => u.id === userId);
    console.log("Updated User Phone:", updatedUser.phone);
}

test();
