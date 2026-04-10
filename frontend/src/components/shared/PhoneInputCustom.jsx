import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import countryTelData from 'country-telephone-data';

/**
 * @typedef {{
 *  name: string;
 *  code: string;
 *  iso2: string;
 * }} Country
 */

/**
 * @typedef {{
 *  value: string;
 *  onChange: (value: string) => void;
 *  errorMessage?: string;
 *  placeholder?: string;
 * }} PhoneInputCustomProps
 */

/** @type {Country[]} */
const countries = countryTelData.allCountries
  .map((country) => ({
    name: country.name,
    code: `+${country.dialCode}`,
    iso2: country.iso2,
  }))
  .sort((first, second) => {
    if (first.name === 'India') return -1;
    if (second.name === 'India') return 1;
    return first.name.localeCompare(second.name);
  });

const defaultCountry = countries.find((country) => country.iso2 === 'in') || countries[0];

/** @param {string} iso2 */
const getFlag = (iso2) => {
  return iso2
    .toUpperCase()
    /** @param {string} char */
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const normalizeDigits = (value = '') => value.replace(/\D/g, '');

/** @param {string} countryCode */
const getCountryDigits = (countryCode) => normalizeDigits(countryCode);

/**
 * @param {string} digits
 * @param {Country} selectedCountry
 */
const formatPhoneNumber = (digits, selectedCountry) => {
  if (!digits) return '';

  if (selectedCountry.code === '+91') {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`.trim();
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`.trim();
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`.trim();
};

/**
 * @param {string} value
 * @returns {{ country: Country; digits: string }}
 */
const resolveCountryFromValue = (value) => {
  const normalizedValue = normalizeDigits(value);

  if (!normalizedValue) {
    return {
      country: defaultCountry,
      digits: '',
    };
  }

  const matchedCountry = [...countries]
    .sort((first, second) => getCountryDigits(second.code).length - getCountryDigits(first.code).length)
    .find((country) => normalizedValue.startsWith(getCountryDigits(country.code)));

  const country = matchedCountry || defaultCountry;
  const countryDigits = getCountryDigits(country.code);
  const digits = normalizedValue.startsWith(countryDigits)
    ? normalizedValue.slice(countryDigits.length)
    : normalizedValue;

  return { country, digits };
};

/** @param {PhoneInputCustomProps} props */
export default function PhoneInputCustom({ value, onChange, errorMessage, placeholder = '98765 43210' }) {
  const wrapperRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const resolved = resolveCountryFromValue(value);
    setSelectedCountry((currentCountry) => {
      const normalizedValue = normalizeDigits(value);
      if (!normalizedValue) {
        return defaultCountry;
      }

      if (normalizedValue.startsWith(getCountryDigits(currentCountry.code))) {
        return currentCountry;
      }

      return resolved.country;
    });
    setPhoneDigits(resolved.digits);
  }, [value]);

  useEffect(() => {
    /** @param {MouseEvent} event */
    const handleClickOutside = (event) => {
      if (wrapperRef.current && event.target instanceof Node && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    /** @param {KeyboardEvent} event */
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return countries;

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(normalizedSearch) ||
        country.code.toLowerCase().includes(normalizedSearch) ||
        country.iso2.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  /** @param {Country} country @param {string} digits */
  const emitValue = (country, digits) => {
    const formattedDigits = formatPhoneNumber(digits, country);
    const nextValue = `${country.code} ${formattedDigits}`.trim();
    onChange(nextValue);
  };

  /** @param {Country} country */
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    emitValue(country, phoneDigits);
  };

  /** @param {import('react').ChangeEvent<HTMLInputElement>} event */
  const handlePhoneChange = (event) => {
    const nextDigits = normalizeDigits(event.target.value);
    setPhoneDigits(nextDigits);
    emitValue(selectedCountry, nextDigits);
  };

  const currentDisplayValue = formatPhoneNumber(phoneDigits, selectedCountry);
  const hasError = Boolean(errorMessage);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex h-12 items-stretch overflow-hidden rounded-xl border bg-white/5 transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500/30 ${
          hasError
            ? 'border-red-400/80'
            : 'border-white/10 hover:border-purple-500/40 focus-within:border-purple-400/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-w-[92px] items-center gap-2 border-r border-white/10 px-3 text-white transition-colors hover:bg-purple-500/10"
          aria-label="Select country code"
          aria-expanded={isOpen}
        >
          <span className="text-lg leading-none">{getFlag(selectedCountry.iso2)}</span>
          <span className="text-sm font-medium">{selectedCountry.code}</span>
          <ChevronDown className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <input
          type="tel"
          name="phone"
          value={currentDisplayValue}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search country"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-2">
            {filteredCountries.map((country) => {
              const isSelected = country.code === selectedCountry.code && country.name === selectedCountry.name;

              return (
                <button
                  key={`${country.name}-${country.code}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-purple-500/20 ${
                    isSelected ? 'bg-purple-500/30 text-white' : 'text-slate-200'
                  }`}
                >
                  <span className="text-lg leading-none">{getFlag(country.iso2)}</span>
                  <span className="font-medium text-white">{country.name}</span>
                  <span className="ml-auto flex items-center gap-2 text-slate-400">
                    <span>{country.code}</span>
                    {isSelected && <Check className="h-4 w-4 text-purple-300" />}
                  </span>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="px-4 py-4 text-sm text-slate-400">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
