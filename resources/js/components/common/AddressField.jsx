import React, { useEffect, useState } from "react";
import { InputField } from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import {
    provinces,
    cities,
    barangays,
    regions,
} from "select-philippines-address";
import { cn } from "@/lib/utils";

export const AddressField = ({ formData, onChange, getFieldError }) => {
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);
    const [allProvinces, setAllProvinces] = useState([]);

    const findProvinceCodeByName = (provinceName) => {
        if (!provinceName) return "";
        const selectedProvince = allProvinces.find(
            (province) => province.province_name === provinceName,
        );
        return selectedProvince?.province_code || "";
    };

    const findCityCodeByName = (cityName) => {
        if (!cityName) return "";
        const selectedCity = cityOptions.find(
            (city) => city.city_name === cityName,
        );
        return selectedCity?.city_code || "";
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

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const regionList = await regions();
                const provinceListByRegion = await Promise.all(
                    (regionList || []).map((region) =>
                        provinces(region.region_code),
                    ),
                );

                const flattenedProvinces = provinceListByRegion
                    .flat()
                    .sort((a, b) =>
                        a.province_name.localeCompare(b.province_name),
                    );

                const uniqueProvinces = getUniqueByKey(
                    flattenedProvinces,
                    "province_code",
                );

                setAllProvinces(uniqueProvinces);
                setProvinceOptions(uniqueProvinces);
            } catch (error) {
                setAllProvinces([]);
                setProvinceOptions([]);
            }
        };

        loadProvinces();
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            const provinceCode = findProvinceCodeByName(formData.state);

            if (!provinceCode) {
                setCityOptions([]);
                return;
            }

            try {
                const cityList = await cities(provinceCode);
                setCityOptions(getUniqueByKey(cityList, "city_code"));
            } catch (error) {
                setCityOptions([]);
            }
        };

        if (allProvinces.length) {
            loadCities();
        }
    }, [formData.state, allProvinces]);

    useEffect(() => {
        const loadBarangays = async () => {
            const cityCode = findCityCodeByName(formData.city);

            if (!cityCode) {
                setBarangayOptions([]);
                return;
            }

            try {
                const barangayList = await barangays(cityCode);
                setBarangayOptions(getUniqueByKey(barangayList, "brgy_code"));
            } catch (error) {
                setBarangayOptions([]);
            }
        };

        if (cityOptions.length) {
            loadBarangays();
        }
    }, [formData.city, cityOptions]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Select
                        value={formData.state || ""}
                        onValueChange={(value) => onChange("state", value)}
                    >
                        <SelectTrigger
                            label="Province"
                            size="sm"
                            variant="light"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinceOptions.map((province) => (
                                <SelectItem
                                    key={`${province.province_code}-${province.province_name}`}
                                    value={province.province_name}
                                >
                                    {province.province_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select
                        value={formData.city || ""}
                        onValueChange={(value) => onChange("city", value)}
                        disabled={!formData.state}
                    >
                        <SelectTrigger
                            label="City"
                            size="sm"
                            variant="light"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                            {cityOptions.map((cityOption) => (
                                <SelectItem
                                    key={`${cityOption.city_code}-${cityOption.city_name}`}
                                    value={cityOption.city_name}
                                >
                                    {cityOption.city_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Select
                        value={formData.address_line_2 || ""}
                        onValueChange={(value) =>
                            onChange("address_line_2", value)
                        }
                        disabled={!formData.city}
                    >
                        <SelectTrigger
                            label="Barangay"
                            size="sm"
                            variant="light"
                            className="w-full"
                        >
                            <SelectValue placeholder="Select barangay" />
                        </SelectTrigger>
                        <SelectContent>
                            {barangayOptions.map((barangayOption) => (
                                <SelectItem
                                    key={`${barangayOption.brgy_code}-${barangayOption.brgy_name}`}
                                    value={barangayOption.brgy_name}
                                >
                                    {barangayOption.brgy_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Street Name (optional) */}
                <div>
                    <InputField
                        label="Street Name (Optional)"
                        value={formData.address_line_1 || ""}
                        onChange={(e) =>
                            onChange("address_line_1", e.target.value)
                        }
                        placeholder="Enter street name"
                        size="xs"
                        variant="light"
                        className={cn(
                            getFieldError("address_line_1") && "border-red-500",
                        )}
                    />
                    {getFieldError("address_line_1") && (
                        <p className="text-red-500 text-xs mt-1">
                            {getFieldError("address_line_1")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
