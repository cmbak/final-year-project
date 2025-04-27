from pytubefix import YouTube


def download_video(url: str) -> tuple[str, str, str, str]:
    """
    Download YT video from url, save in media directory and return tuple consisting of
    file name of mp4 and embed url for video
    """
    yt = YouTube(url)
    id = yt.video_id
    print(yt.title, id)
    ys = yt.streams.get_lowest_resolution()
    file_path = ys.download("./media", f"{id}.mp4")
    thumbnail_url = yt.thumbnail_url
    return (file_path, yt.embed_url, thumbnail_url, id)
