from pytubefix import YouTube


def download_video(url: str) -> str:
    """
    Download YT video from url, save in media directory and return file name of mp4
    """
    yt = YouTube(url)
    print(yt.title)
    ys = yt.streams.get_lowest_resolution()
    file_path = ys.download("./media")
    print(file_path)
    return file_path
