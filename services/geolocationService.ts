import { GeolocationPermission } from '@/model/types';

export const requestGeolocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
};

export const checkGeolocationPermission =
  async (): Promise<GeolocationPermission> => {
    if (!navigator.permissions) {
      return GeolocationPermission.Prompt;
    }

    try {
      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName,
      });

      return result.state as GeolocationPermission;
    } catch {
      return GeolocationPermission.Prompt;
    }
  };
