/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/form',
                destination: '/form/index.html',
                permanent: true,
            }
        ];
    },
};

export default nextConfig;
