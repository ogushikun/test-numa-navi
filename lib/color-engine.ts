import { ColorProfile } from '@/types';

export function calculateBaseColor(profiles: ColorProfile[]): string {
    if (profiles.length === 0) return 'hsl(240, 50%, 20%)';

    // Weighted average: more weight to recent answers
    const totalWeight = profiles.reduce((acc, _, i) => acc + (i + 1), 0);

    const weightedAverage = profiles.reduce(
        (acc, p, i) => {
            const weight = (i + 1);
            return {
                temp: acc.temp + p.temp * weight,
                brightness: acc.brightness + p.brightness * weight,
                saturation: acc.saturation + p.saturation * weight,
                hueShift: acc.hueShift + p.hueShift * weight,
            };
        },
        { temp: 0, brightness: 0, saturation: 0, hueShift: 0 }
    );

    const final = {
        temp: weightedAverage.temp / totalWeight,
        brightness: weightedAverage.brightness / totalWeight,
        saturation: weightedAverage.saturation / totalWeight,
        hueShift: weightedAverage.hueShift / totalWeight,
    };

    // temp 0 -> Blue (240), temp 100 -> Red (0)
    let baseHue = 240 - (final.temp * 2.4);

    if (final.temp > 70) {
        baseHue = (baseHue - 20 + 360) % 360;
    } else if (final.temp < 30) {
        baseHue = (baseHue + 20 + 360) % 360;
    }

    baseHue = (baseHue + final.hueShift + 360) % 360;

    const saturation = Math.max(10, Math.min(100, final.saturation));
    const lightness = Math.max(5, Math.min(80, final.brightness * 0.6));

    return `hsl(${Math.round(baseHue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
}

export function generateGradient(profiles: ColorProfile[]) {
    const baseColorString = calculateBaseColor(profiles);

    // Extract H, S, L values
    const match = baseColorString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const h = match ? parseInt(match[1]) : 0;
    const s = match ? parseInt(match[2]) : 0;
    const l = match ? parseInt(match[3]) : 0;

    const lastProfile = profiles[profiles.length - 1];

    const secondaryHue = (h + 40 + 360) % 360;
    const secondaryS = Math.min(100, s + 10);
    const secondaryL = Math.max(0, l - 10);
    const secondaryColor = `hsl(${Math.round(secondaryHue)}, ${Math.round(secondaryS)}%, ${Math.round(secondaryL)}%)`;

    let gradient = `radial-gradient(circle at 20% 30%, ${baseColorString} 0%, rgba(0,0,0,0.9) 120%)`;

    if (lastProfile && lastProfile.temp > 60) {
        gradient = `linear-gradient(135deg, ${baseColorString} 0%, ${secondaryColor} 50%, rgba(0,0,0,0.9) 100%)`;
    } else if (lastProfile && lastProfile.temp < 40) {
        gradient = `radial-gradient(circle at center, ${baseColorString} 0%, ${secondaryColor} 40%, rgba(0,0,0,1) 100%)`;
    }

    return {
        background: gradient,
        className: lastProfile?.texture || ''
    };
}
