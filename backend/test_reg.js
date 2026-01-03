// import fetch from 'node-fetch';

async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Admin User",
                email: "admin@test.com",
                password: "password123",
                employeeId: "ADM001",
                role: "ADMIN"
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

test();
