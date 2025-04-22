"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface LastPlayingTrack {
  image: { "#text": string; size: string }[];
  artist: {
    "#text": string;
    mbid: string;
  };
  album: {
    "#text": string;
    mbid: string;
  };
  "@attr"?: {
    nowplaying?: string;
  };
  name: string;
  streamable: number;
  mbid: string;
  url: string;
}

export default function MyPlayingWidget() {
  const user = process.env.NEXT_PUBLIC_LAST_FM_USERNAME;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}&user=${user}&api_key=${apiKey}&format=json&limit=5`;
  const noMusicPlayingRef = useRef<NodeJS.Timeout | number | undefined>(0);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [lastPlayingTrack, setLastPlayingTrack] = useState<LastPlayingTrack>({
    image: [],
    artist: { "#text": "", mbid: "" },
    album: { "#text": "", mbid: "" },
    "@attr": { nowplaying: "" },
    name: "",
    streamable: 0,
    mbid: "",
    url: "",
  });

  useEffect(() => {
    fetchLastFMData();
    noMusicPlayingRef.current = setInterval(() => {
      fetchLastFMData();
    }, 15000);
    return () => clearInterval(noMusicPlayingRef.current);
  }, []);

  useEffect(() => {
    if (isMusicPlaying) {
      clearInterval(noMusicPlayingRef.current);
      noMusicPlayingRef.current = setInterval(() => {
        fetchLastFMData();
      }, 7000);
    } else {
      clearInterval(noMusicPlayingRef.current);
      noMusicPlayingRef.current = setInterval(() => {
        fetchLastFMData();
      }, 15000);
    }
    return () => clearInterval(noMusicPlayingRef.current);
  }, [isMusicPlaying]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setShowMusic(false);
      }
    };

    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      // if (event.origin !== "https://your-expected-origin.com") return;

      if (event.data.type === "close-iframe-widget") {
        setShowMusic(false);
      }
    };

    if (showMusic) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("message", handleMessage);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("message", handleMessage);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("message", handleMessage);
    };
  }, [showMusic]);

  const fetchLastFMData = async () => {
    try {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data?.recenttracks?.track && data?.recenttracks?.track.length) {
            setLastPlayingTrack(data.recenttracks.track[0]);
            if (
              data?.recenttracks?.track[0]["@attr"] &&
              data?.recenttracks?.track[0]["@attr"]?.nowplaying
            ) {
              setIsMusicPlaying(true);
            } else {
              setIsMusicPlaying(false);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <span className="relative flex justify-end">
        {isMusicPlaying && !showMusic && (
          <span
            className="listening-music-container"
            id="listening-music-container"
            onClick={() => setShowMusic(true)}
          >
            <span className="music">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </span>
          </span>
        )}
        {showMusic && (
          <div ref={widgetRef}>
            <Link
              className="lastfm-widget flex p-1 cursor-pointer w-[350px] h-[80px] rounded-xl bg-[#3436429e] gap-4 justify-end items-center absolute top-0 left-0 shadow-xl"
              href={lastPlayingTrack.url}
              target="_blank"
            >
              {lastPlayingTrack.image?.[2]?.["#text"] && (
                <Image
                  src={lastPlayingTrack.image[2]["#text"]}
                  alt="playing"
                  className="w-[23%] h-full rounded-xl"
                  width={45}
                  height={45}
                />
              )}
              {isMusicPlaying && (
                <Image
                  src="/animation.gif"
                  alt="playing"
                  className="absolute top-1/6 left-[5%] w-[45px]"
                  width={45}
                  height={20}
                />
              )}

              <span className="flex w-[90%] h-[75%] flex-col justify-evenly items-start px-2">
                {isMusicPlaying && (
                  <span className="text-xs font-light font-sans tracking-wide">Listening to </span>
                )}
                <span className="max-w-52 overflow-ellipsis overflow-hidden whitespace-nowrap font-sans">
                  <span className="text-lg font-bold">
                    {lastPlayingTrack.name}
                  </span>
                  <span className="text-md font-medium">
                    {lastPlayingTrack?.artist?.["#text"]
                      ? ` - ${lastPlayingTrack.artist["#text"]}`
                      : ""}
                  </span>
                </span>
                <span className="font-normal font-mono max-w-[200px] text-ellipsis overflow-hidden whitespace-nowrap text-xs">
                  {lastPlayingTrack.album["#text"]}
                </span>
              </span>
            </Link>
          </div>
        )}
      </span>
    </>
  );
}
