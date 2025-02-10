from yt_dlp import YoutubeDL


def download_video(url: str) -> str:
    """
    Download YT video from url, save in /media directory and return FILE NAME of mp4
    """
    options = {
        "paths": {"home": "./media"},
        "clean_infojson": True,
        "allow_multiple_audio_streams": True,
    }
    downloader = YoutubeDL(options)

    info = downloader.extract_info(url=url, download=True)
    file_name = f"{info['title']} [{info['id']}].mp4"  # title of video [video id].mp4
    return file_name
