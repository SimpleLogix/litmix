export const requestToken = async () => {
    try {
        const response = await fetch('https://us-central1-lit-mix.cloudfunctions.net/myFunction');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return { response: 'Error occurred' };
    }
};
