'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export function PropertyValuation() {
    const [monthlyRent, setMonthlyRent] = useState(20000);
    const [landPrice, setLandPrice] = useState(5000);
    const [builtUpArea, setBuiltUpArea] = useState(1000);
    const [fsi, setFsi] = useState(1.5);
    const [currentYield, setCurrentYield] = useState(3);
    const [buildingAge, setBuildingAge] = useState(5);
    const [landInflation, setLandInflation] = useState(8);
    const [futureFsi, setFutureFsi] = useState(2);
    const [landValue, setLandValue] = useState(0);
    const [buildingValue, setBuildingValue] = useState(0);
    const [projectedValues, setProjectedValues] = useState([]);

    const calculateValues = () => {
        const LIFESPAN = 60;
        const YEARS_TO_PROJECT = 10;

        // Land value calculation
        const landArea = Math.ceil(builtUpArea / fsi);
        const totalLandValue = Math.ceil(landArea * landPrice);
        setLandValue(totalLandValue);

        // Building value calculation
        const annualRent = monthlyRent * 12;
        const initialBuildingValue = Math.ceil(annualRent * 100 / currentYield);
        const currentBuildingValue = Math.ceil(initialBuildingValue * (1 - buildingAge/LIFESPAN));
        setBuildingValue(currentBuildingValue);

        // Calculate projections
        const projectionData = [];

        // Add current year values
        projectionData.push({
            year: 'Current',
            landValue: totalLandValue,
            buildingValue: currentBuildingValue,
            totalValue: totalLandValue + currentBuildingValue,
            rentalValue: annualRent
        });

        // Project future years
        for (let year = 1; year <= YEARS_TO_PROJECT; year++) {
            // Land value grows with inflation and FSI benefit
            const landValueGrowth = Math.ceil(totalLandValue * Math.pow(1 + landInflation/100, year));
            const fsiIncreaseBenefit = (futureFsi - fsi) > 0 ? 
                Math.ceil((futureFsi - fsi) * landArea * landPrice * (year/10)) : 0;
            const yearLandValue = landValueGrowth + fsiIncreaseBenefit;

            // Building value simple age-based depreciation
            const effectiveAge = buildingAge + year;
            const yearBuildingValue = Math.max(0, Math.ceil(initialBuildingValue * (1 - effectiveAge/LIFESPAN)));

            projectionData.push({
                year: `Year ${year}`,
                landValue: yearLandValue,
                buildingValue: yearBuildingValue,
                totalValue: yearLandValue + yearBuildingValue,
                rentalValue: annualRent
            });
        }

        setProjectedValues(projectionData);
    };

    useEffect(() => {
        calculateValues();
    }, [monthlyRent, landPrice, builtUpArea, fsi, currentYield, buildingAge, landInflation, futureFsi]);

    const LabelWithTooltip = ({ htmlFor, label, tooltip }) => (
        <div className="flex items-center gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Indian Property Valuation Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="current">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="current">Current Valuation</TabsTrigger>
                        <TabsTrigger value="future">Future Projections</TabsTrigger>
                    </TabsList>

                    <TabsContent value="current" className="space-y-6">
                        <div className="grid gap-4">
                            <div>
                                <LabelWithTooltip
                                    htmlFor="monthly-rent"
                                    label="Monthly Rent (₹)"
                                    tooltip="The current market rent for similar properties in your area"
                                />
                                <Input 
                                    id="monthly-rent"
                                    type="number" 
                                    value={monthlyRent} 
                                    onChange={e => setMonthlyRent(Number(e.target.value))}
                                    className="mt-1"
                                    min="0"
                                />
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="land-price"
                                    label="Land Price (₹/sq ft)"
                                    tooltip="Current market price of land per square foot in your area"
                                />
                                <Input 
                                    id="land-price"
                                    type="number" 
                                    value={landPrice} 
                                    onChange={e => setLandPrice(Number(e.target.value))}
                                    className="mt-1"
                                    min="0"
                                />
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="built-up-area"
                                    label="Built-up Area (sq ft)"
                                    tooltip="Total constructed area including walls"
                                />
                                <Input 
                                    id="built-up-area"
                                    type="number" 
                                    value={builtUpArea} 
                                    onChange={e => setBuiltUpArea(Number(e.target.value))}
                                    className="mt-1"
                                    min="0"
                                />
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="building-age"
                                    label="Building Age (years)"
                                    tooltip="Current age of the building"
                                />
                                <Input 
                                    id="building-age"
                                    type="number" 
                                    value={buildingAge} 
                                    onChange={e => setBuildingAge(Number(e.target.value))}
                                    className="mt-1"
                                    min="0"
                                    max="60"
                                />
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="current-fsi"
                                    label="Current FSI"
                                    tooltip="Floor Space Index - ratio of total built-up area to plot area"
                                />
                                <Input 
                                    id="current-fsi"
                                    type="number" 
                                    value={fsi} 
                                    onChange={e => setFsi(Number(e.target.value))}
                                    step="0.1"
                                    className="mt-1"
                                    min="0"
                                />
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="current-yield"
                                    label="Current Rental Yield (%)"
                                    tooltip="Annual rental income as a percentage of property value"
                                />
                                <Slider
                                    value={[currentYield]}
                                    onValueChange={value => setCurrentYield(value[0])}
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    className="mt-2"
                                />
                                <div className="text-sm text-gray-500 mt-1">{currentYield}%</div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg border p-4 shadow-sm">
                                    <h3 className="text-sm text-gray-500">Land Value</h3>
                                    <p className="text-2xl font-bold">₹{landValue.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400">₹{Math.ceil(landValue/builtUpArea).toLocaleString('en-IN')}/sq ft</p>
                                </div>
                                <div className="bg-white rounded-lg border p-4 shadow-sm">
                                    <h3 className="text-sm text-gray-500">Building Value</h3>
                                    <p className="text-2xl font-bold">₹{buildingValue.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400">₹{Math.ceil(buildingValue/builtUpArea).toLocaleString('en-IN')}/sq ft</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border p-4 shadow-sm">
                                <h3 className="text-sm text-gray-500">Total Property Value</h3>
                                <p className="text-2xl font-bold">₹{(landValue + buildingValue).toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-400">₹{Math.ceil((landValue + buildingValue)/builtUpArea).toLocaleString('en-IN')}/sq ft</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="future" className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <LabelWithTooltip
                                    htmlFor="land-inflation"
                                    label="Expected Land Price Inflation (%)"
                                    tooltip="Annual increase in land prices"
                                />
                                <Slider
                                    value={[landInflation]}
                                    onValueChange={value => setLandInflation(value[0])}
                                    min={0}
                                    max={15}
                                    step={0.5}
                                    className="mt-2"
                                />
                                <div className="text-sm text-gray-500 mt-1">{landInflation}%</div>
                            </div>

                            <div>
                                <LabelWithTooltip
                                    htmlFor="future-fsi"
                                    label="Expected Future FSI"
                                    tooltip="Anticipated future FSI based on development plans"
                                />
                                <Slider
                                    value={[futureFsi]}
                                    onValueChange={value => setFutureFsi(value[0])}
                                    min={fsi}
                                    max={4}
                                    step={0.1}
                                    className="mt-2"
                                />
                                <div className="text-sm text-gray-500 mt-1">{futureFsi}</div>
                            </div>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={projectedValues}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis tickFormatter={value => `₹${(value/100000).toFixed(1)}L`} />
                                        <RechartsTooltip formatter={value => [`₹${value.toLocaleString('en-IN')}`, 'Value']} />
                                        <Legend />
                                        <Line type="monotone" dataKey="landValue" name="Land Value" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="buildingValue" name="Building Value" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="totalValue" name="Total Value" stroke="#ff7300" strokeWidth={2} />
                                        <Line type="monotone" dataKey="rentalValue" name="Annual Rental" stroke="#ffc658" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}