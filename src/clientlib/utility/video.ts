class VideoUtility {
  public isYoutubeVideoUrl(url: string): boolean {
    return !!url && /^https?:\/\/(www\.)?youtu\.?be(\.com)?/i.test(url);
  }

  public isVimeoVideoUrl(url: string): boolean {
    if (!url) {
      return false;
    }
    return /vimeo/i.test(url);
  }

  public getVimeoId(url: string): string | null {
    if (!url) {
      return null;
    }
    const arr = url.match(/\/(\d+)$/i);
    return arr ? arr[1] : null;
  }

  public getEmbedHostedVideoUrl(
    url: string,
    autoplay = true,
    loop = true
  ): string | null {
    if (this.isVimeoVideoUrl(url)) {
      return this.getHostedVideoUrl(url) + "?background=1";
    }
    if (this.isYoutubeVideoUrl(url)) {
      const youtubeId = this.getYoutubeId(url);
      if (!youtubeId) {
        return null;
      }
      const params = new URLSearchParams({
        controls: "1",
        autoplay: autoplay ? "1" : "",
        loop: loop ? "1" : "",
        showinfo: "0",
        rel: "0",
        enablejsapi: "1",
        wmode: "transparent",
        playlist: youtubeId,
      });
      return this.getHostedVideoUrl(url) + "?" + params.toString();
    }
    return url;
  }

  public getVimeoEmbedUrl(
    url: string,
    autoplay = true,
    loop = true
  ): string | null {
    if (!url) {
      return null;
    }
    const vimeoId = this.getVimeoId(url);
    if (!vimeoId) {
      return null;
    }

    const parsedUrl = new URL(url);
    let params: URLSearchParams;

    // If input URL already has query params, use them
    if (parsedUrl.search && parsedUrl.searchParams.toString()) {
      params = new URLSearchParams(parsedUrl.searchParams);
    } else {
      // Otherwise, use default params
      params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        loop: loop ? "1" : "0",
        player_id: vimeoId,
      });
    }

    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  }

  public getYoutubeEmbedUrl(
    url: string,
    autoplay = true,
    loop = true
  ): string | null {
    if (!url) {
      return null;
    }
    const youtubeId = this.getYoutubeId(url);

    if (!youtubeId) {
      return null;
    }

    const params = new URLSearchParams({
      controls: "1",
      autoplay: autoplay ? "1" : "",
      loop: loop ? "1" : "",
      showinfo: "0",
      rel: "0",
      enablejsapi: "1",
      wmode: "transparent",
      playlist: youtubeId,
    });

    return (
      `https://www.youtube.com/embed/${youtubeId}` + "?" + params.toString()
    );
  }

  public getYoutubeId(url: string): string | null {
    if (!url) {
      return null;
    }
    const arr = url.match(
      /(?<=(v=|\/v\/|embed\/|youtu.be\/|\/embed\/|\/v=|\/embed\/videoseries\?list=|\/videoseries\?list=))([\w-]{11})(?![\w-])/i
    );
    return arr ? arr[0] : null;
  }

  public isContentfulVideoUrl(url: string): boolean {
    if (!url) {
      return false;
    }

    const contentfulVideoUrlPattern =
      /^(https:|http:)?(\/\/)?videos\.ctfassets\.net\//;

    const secureAssetVideoPattern = /\/secureasset\/videos\//;

    return (
      contentfulVideoUrlPattern.test(url) || secureAssetVideoPattern.test(url)
    );
  }

  public getHostedVideoUrl(url: string): { url: string; type: string } | null {
    if (!url) {
      return null;
    }
    if (this.isVimeoVideoUrl(url)) {
      const vimeoId = this.getVimeoEmbedUrl(url, true, true);
      return vimeoId ? { url: vimeoId, type: "vimeo" } : null;
    }
    if (this.isYoutubeVideoUrl(url)) {
      const youtubeId = this.getYoutubeEmbedUrl(url, true, true);
      return youtubeId ? { url: youtubeId, type: "youtube" } : null;
    }

    if (this.isContentfulVideoUrl(url)) {
      return { url, type: "CMS" };
    }

    return { url, type: "other" };
  }
}

const videoUtility = new VideoUtility();

export default videoUtility;
