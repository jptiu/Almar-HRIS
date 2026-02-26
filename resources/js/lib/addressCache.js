import {
  provinces,
  cities,
  barangays,
  regions,
} from "select-philippines-address";

/**
 * In-memory cache for Philippine address data.
 * Fetches from the API only once per session; subsequent calls return cached data.
 */

const cache = {
  provinces: null,
  cities: new Map(),
  barangays: new Map(),
  // Track in-flight promises to avoid duplicate concurrent requests
  _provincesPromise: null,
  _citiesPromises: new Map(),
  _barangaysPromises: new Map(),
};

const getUniqueByKey = (items, keyName) => {
  const uniqueMap = new Map();
  (items || []).forEach((item) => {
    const keyValue = item?.[keyName];
    if (keyValue && !uniqueMap.has(keyValue)) {
      uniqueMap.set(keyValue, item);
    }
  });
  return Array.from(uniqueMap.values());
};

/**
 * Fetch all provinces (across all regions), cached after first call.
 */
export const fetchProvinces = () => {
  if (cache.provinces) {
    return Promise.resolve(cache.provinces);
  }

  if (!cache._provincesPromise) {
    cache._provincesPromise = regions()
      .then((regionList) =>
        Promise.all(
          (regionList || []).map((region) =>
            provinces(region.region_code),
          ),
        ),
      )
      .then((provinceListByRegion) => {
        const flattenedProvinces = provinceListByRegion
          .flat()
          .sort((a, b) =>
            a.province_name.localeCompare(b.province_name),
          );

        const uniqueProvinces = getUniqueByKey(
          flattenedProvinces,
          "province_code",
        );

        cache.provinces = uniqueProvinces;
        cache._provincesPromise = null;
        return uniqueProvinces;
      })
      .catch((error) => {
        cache._provincesPromise = null;
        return [];
      });
  }

  return cache._provincesPromise;
};

/**
 * Fetch cities for a given province code, cached per province.
 */
export const fetchCities = (provinceCode) => {
  if (!provinceCode) return Promise.resolve([]);

  if (cache.cities.has(provinceCode)) {
    return Promise.resolve(cache.cities.get(provinceCode));
  }

  if (!cache._citiesPromises.has(provinceCode)) {
    const promise = cities(provinceCode)
      .then((cityList) => {
        const uniqueCities = getUniqueByKey(cityList, "city_code");
        cache.cities.set(provinceCode, uniqueCities);
        cache._citiesPromises.delete(provinceCode);
        return uniqueCities;
      })
      .catch(() => {
        cache._citiesPromises.delete(provinceCode);
        return [];
      });

    cache._citiesPromises.set(provinceCode, promise);
  }

  return cache._citiesPromises.get(provinceCode);
};

/**
 * Fetch barangays for a given city code, cached per city.
 */
export const fetchBarangays = (cityCode) => {
  if (!cityCode) return Promise.resolve([]);

  if (cache.barangays.has(cityCode)) {
    return Promise.resolve(cache.barangays.get(cityCode));
  }

  if (!cache._barangaysPromises.has(cityCode)) {
    const promise = barangays(cityCode)
      .then((barangayList) => {
        const uniqueBarangays = getUniqueByKey(
          barangayList,
          "brgy_code",
        );
        cache.barangays.set(cityCode, uniqueBarangays);
        cache._barangaysPromises.delete(cityCode);
        return uniqueBarangays;
      })
      .catch(() => {
        cache._barangaysPromises.delete(cityCode);
        return [];
      });

    cache._barangaysPromises.set(cityCode, promise);
  }

  return cache._barangaysPromises.get(cityCode);
};
