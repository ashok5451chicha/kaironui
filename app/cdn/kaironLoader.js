/* eslint-disable */
(function () {
    const kaironProd = 'https://kairon-api.digite.com';
    const kaironDev = 'http://192.168.100.109:8080';

    const getUrlParams = (url) => {
        const variables = {};
        const parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
            variables[key] = value;
        });

        return variables;
    };

    const initClient = () => {
        const kaironScript = document.getElementById('kairon-client-src');
        const params = getUrlParams(kaironScript.src);

        const kaironURL = kaironScript.src?.includes('://kairon') ? kaironProd : kaironDev;

        fetch(`${kaironURL}/api/bot/${params.botid}/chat/client/config/${params.token}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((responseObject) => {
                if (responseObject.success) {
                    const configObject = responseObject.data;

                    configObject.container = '#kairon-client-container';
                    configObject.host = `${kaironURL}/api/bot/${params.botid}/chat`;

                    if (window.ChatClient) {
                        window.ChatClient(configObject);
                    } else if (top.ChatClient) {
                        top.ChatClient(configObject);
                    }
                }
            });
    };

    appendChildren = () => {
        const body = document.getElementsByTagName('body')[0];

        const container = document.createElement('div');
        container.id = 'kairon-client-container';

        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://kairon.digite.com/cdn/kairon_client.js';

        scriptTag.onload = initClient;

        body.appendChild(container);
        body.appendChild(scriptTag);
    };

    window.addEventListener('load', appendChildren);
})();
