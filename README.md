# myLiveMusic

Website to show my current playing song as iframe

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## For your use

*  Clone this repo deploy in a server(a free hosting is only required)
*  Provide these environment variables for development

```environment
NEXT_PUBLIC_API_KEY=<your_lastfm_api_key>
NEXT_PUBLIC_LAST_FM_USERNAME=<your_lastfm_username>
NEXT_PUBLIC_API_BASE_URL=https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks
```

After deployment, use the website URL as iframe source.

(You can customize styles as your preferences (tailwind included))


### Contributions are Welcomed. 😀
