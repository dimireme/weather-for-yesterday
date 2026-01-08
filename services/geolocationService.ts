export const requestGeolocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
};

export const checkGeolocationPermission = async (): Promise<
  'granted' | 'prompt' | 'denied'
> => {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({
      name: 'geolocation' as PermissionName,
    });

    return result.state as 'granted' | 'prompt' | 'denied';
  } catch {
    return 'prompt';
  }
};
