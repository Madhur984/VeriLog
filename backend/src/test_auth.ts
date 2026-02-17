async function testSignIn() {
    console.log('--- Auth Test Starting ---');
    try {
        const response = await fetch('http://localhost:3000/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'gmadhur908@gmail.com',
                password: 'wrong_password'
            })
        });

        console.log('Response Status:', response.status);
        const data = await response.json();
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('--- Test Error ---');
        console.log(error);
    }
}

testSignIn();
