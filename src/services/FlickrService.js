export async function fetchPhotos() {
    const urlParams = {
        api_key: '79751713d5da47647b8bc90a66de3a85',
        photoset_id: '72177720303368765',
        user_id: '196846231@N07',
        format: 'json',
        per_page: '120',
        extras: 'url_m,url_c,url_l,url_h,url_o',
        nojsoncallback: '1'
      };
  
      let url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos';
      url = Object.keys(urlParams).reduce((acc, item) => {
        return acc + '&' + item + '=' + urlParams[item];
      }, url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        return await response;
    } catch (error) {
        console.log('Error calling getAllPhotos: ' + JSON.stringify(error));
        return [];
    }
}