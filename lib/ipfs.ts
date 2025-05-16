import axios from 'axios';

export const pinFileToIPFS = async (buffer: Buffer, name: string) => {
    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append('file', blob, name);
    formData.append('pinataMetadata', JSON.stringify({ name }));

    const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                'Content-Type': `multipart/form-data`
            }
        }
    );

    return res.data.IpfsHash;
};

export const pinJSONToIPFS = async (data: any) => {
    const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return res.data.IpfsHash;
};