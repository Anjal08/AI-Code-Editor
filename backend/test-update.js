const run = async () => {
    try {
        const email = `testuser_${Date.now()}@test.com`;
        const password = 'password123';
        console.log(`Registering ${email}...`);
        
        let res = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        let data = await res.json();
        let token = data.token;
        console.log('Registered successfully! Token received.');

        console.log('Attempting to create project...');
        res = await fetch('http://localhost:3000/projects/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'My New Project'
            })
        });

        let rawData = await res.text();
        try { data = JSON.parse(rawData); } catch(e) { console.error("Not JSON:", rawData); return; }

        if (!res.ok) {
            console.error('ERROR OCCURRED:');
            console.error('Status:', res.status);
            console.error('Data:', JSON.stringify(data, null, 2));
        } else {
            console.log('Update successful!', data);
        }
    } catch (err) {
        console.error(err);
    }
};

run();
