// utils/colorUtils.ts
import React from 'react';

export const getRankColorStyle = (rank: string): React.CSSProperties => {
    const lowerRank = rank.toLowerCase().trim();
    
    const colorMap: Record<string, string> = {
        'branca': '#ffffff',
        'cinza': '#808080',
        'azul': '#007bff',
        'amarela': '#ffc107',
        'vermelha': '#dc3545',
        'laranja': '#fd7e14',
        'verde': '#28a745',
        'roxa': '#6f42c1',
        'marrom': '#8B4513',
        'preta': '#000000',
    };

    const parts = lowerRank.split(/\s+e\s+/);

    if (parts.length === 2) {
        const color1 = colorMap[parts[0]] || '#6c757d'; // default gray
        const color2 = colorMap[parts[1]] || '#6c757d';
        return { background: `linear-gradient(to right, ${color1} 50%, ${color2} 50%)` };
    }
    
    const singleColor = colorMap[lowerRank];
    if (singleColor) {
         const style: React.CSSProperties = { backgroundColor: singleColor };
         if (singleColor === '#ffffff') {
             style.border = '1px solid #dee2e6';
         }
         return style;
    }

    // Fallback for custom colors not in the map
    return { backgroundColor: '#6c757d', border: '1px solid #343a40' };
};
