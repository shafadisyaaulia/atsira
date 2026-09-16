"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";

interface Province {
  id: string;
  nama: string;
}

interface Regency {
  id: string;
  nama: string;
}

interface RegionCascadeProps {
  value?: string;
  onChange: (region: string) => void;
  disabled?: boolean;
}

function toTitleCase(str: string): string {
  return str
    .replace(/^(KABUPATEN|KOTA|PROVINSI)\s+/i, "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const PROVINCES_URL = "https://ibnux.github.io/data-indonesia/provinsi.json";

export function RegionCascade({ value, onChange, disabled }: RegionCascadeProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
  const [selectedRegency, setSelectedRegency] = useState<string>("");
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(PROVINCES_URL)
      .then((r) => r.json())
      .then((data: Province[]) => {
        setProvinces(data);
        setLoadingProvinces(false);
      })
      .catch(() => {
        setErrorMsg("Gagal memuat daftar provinsi.");
        setLoadingProvinces(false);
      });
  }, []);

  async function handleProvinceChange(provinceId: string, provinceName: string) {
    setSelectedProvinceId(provinceId);
    setSelectedProvinceName(provinceName);
    setSelectedRegency("");
    onChange("");
    setRegencies([]);
    if (!provinceId) return;

    setLoadingRegencies(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`https://ibnux.github.io/data-indonesia/kabupaten/${provinceId}.json`);
      const data: Regency[] = await res.json();
      setRegencies(data);
    } catch {
      setErrorMsg("Gagal memuat daftar kabupaten/kota.");
    } finally {
      setLoadingRegencies(false);
    }
  }

  function handleRegencyChange(regencyRaw: string) {
    const regencyName = toTitleCase(regencyRaw);
    setSelectedRegency(regencyName);
    const provinceName = toTitleCase(selectedProvinceName);
    onChange(`${regencyName}, ${provinceName}`);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
        {loadingProvinces ? (
          <div className="w-full border border-stone-200 rounded-xl p-2.5 bg-white text-xs text-stone-400 flex items-center gap-2 pl-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat provinsi...
          </div>
        ) : (
          <select
            disabled={disabled || loadingProvinces}
            value={selectedProvinceId}
            className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white pl-8 appearance-none disabled:opacity-60 outline-none focus:border-emerald-400"
            onChange={(e) => {
              const opt = e.target.options[e.target.selectedIndex];
              handleProvinceChange(e.target.value, opt.text);
            }}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {toTitleCase(p.nama)}
              </option>
            ))}
          </select>
        )}
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
      </div>

      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
        {loadingRegencies ? (
          <div className="w-full border border-stone-200 rounded-xl p-2.5 bg-white text-xs text-stone-400 flex items-center gap-2 pl-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat kabupaten/kota...
          </div>
        ) : (
          <select
            disabled={disabled || !selectedProvinceId || loadingRegencies}
            value={selectedRegency}
            className="w-full text-xs border border-stone-200 rounded-xl p-2.5 bg-white pl-8 appearance-none disabled:opacity-60 outline-none focus:border-emerald-400"
            onChange={(e) => handleRegencyChange(e.target.value)}
          >
            <option value="">
              {selectedProvinceId ? "-- Pilih Kabupaten/Kota --" : "-- Pilih Provinsi Dulu --"}
            </option>
            {regencies.map((r) => (
              <option key={r.id} value={r.nama}>
                {toTitleCase(r.nama)}
              </option>
            ))}
          </select>
        )}
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
      </div>

      {errorMsg && <p className="text-[11px] text-red-500">{errorMsg}</p>}
    </div>
  );
}
