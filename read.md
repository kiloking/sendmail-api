   //form的頭要改成這樣
   <form id="emailForm">


   //新增送信的程式碼
    <script>
        document.getElementById('emailForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const to = '專案信箱';
            const subject = xxxx網站名稱的表單';

            const customerName = formData.get('customerName');
            const phoneNumber = formData.get('phoneNumber');
            const gender = formData.get('gender');
            const city = formData.get('city');
            const district = formData.get('district');


            const text = `顧客姓名: ${customerName}\n聯絡電話: ${phoneNumber}\n性別: ${gender\n居住縣市: ${city}\n居住地區: ${district}`;

            const data = {
                to: to,
                subject: subject,
                text: text
            };

            try {
                const response = await fetch('https://sendmail-api-umber.vercel.app/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Email sent successfully');
                } else {
                    alert('Error sending email: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error sending email: ' + error.message);
            }
        });
    </script>