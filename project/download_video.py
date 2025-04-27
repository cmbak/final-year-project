from pytubefix import YouTube


def download_video(url: str) -> tuple[str, str, str]:
    """
    Download YT video from url, save in media directory and return tuple consisting of
    file name of mp4 and embed url for video
    """
    yt = YouTube(url)
    print(yt.title)
    ys = yt.streams.get_lowest_resolution()
    file_path = ys.download("./media")
    thumbnail_url = yt.thumbnail_url
    return (file_path, yt.embed_url, thumbnail_url)
