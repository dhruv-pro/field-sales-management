export const getCurrentLocation = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: "Live Location",
        });
      },
      (err) => reject(err),
    );
  });
};
