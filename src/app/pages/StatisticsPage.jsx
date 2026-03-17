import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import {Line, LineChart, Tooltip, Legend, XAxis, YAxis, CartesianGrid, Label} from "recharts";


export function StatisticsPage() {
    const { t } = useTranslation();
    const [view, setView] = useState('Day'); //saves which button view is active.
    const currentDate = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',

    });//Managing and saving the date.
    const [thisDate, setThisDate] = useState(currentDate); //Managing and saving the date.
    const [popupOpen, setPopupOpen] = useState(false); //Calender Popup managment

    /* statisticData is the Mocked data space. It was meant to look like this in bigger scale:
    const statisticData = [
        {
            date: '05.01.2026',
             category:[
                {time: 1.25, name: 'Math', start: '12:00'}
                {...}
             ]
        },
        {
            date: "06.01.2026",
            category:[
            {time: 2.5, name: 'Math', start: '10:00'}
            {...}
            ]
        },
        ...
    ]
        But I have not managed to make the chart take multiple category instances with the same date.
     */
    const statisticData = [
        {
            date: '05.01.2026', time: 1.25, name: 'Math', start: '12:00'
        },
        {
            date: "06.01.2026", time: 2.5, name: 'Math', start: '10:00'
        },
        {
            date: "08.01.2026", time: 0.5, name: 'Math', start: '19:00'
        },
        {
            date: "12.01.2026", time: 5.5, name: 'Math', start: '08:00'
        },
        {
            date: "20.01.2026", time: 6.0, name: 'Math', start: '13:00'
        }
    ]

    const Buttons = () => { //Controll buttons with highlighting.
        return (
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-nowrap sm:justify-center">
                <button
                    onClick={() => setView('Day')}
                    className={
                        `w-full sm:w-auto px-8 py-2 rounded-full font-medium transition-colors ${
                            view === 'Day'

                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`
                    }
                > {t('statistics.view.day')} </button>

                <button
                    onClick={() => setView('Week')}
                    className={
                        `w-full sm:w-auto px-8 py-2 rounded-full font-medium transition-colors ${
                            view === 'Week'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`
                    }
                > {t('statistics.view.week')} </button>

                <button
                    onClick={() => setView('Month')}
                    className={
                        `w-full sm:w-auto px-8 py-2 rounded-full font-medium transition-colors ${
                            view === 'Month'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`
                    }
                > {t('statistics.view.month')} </button>

                <button
                    onClick={() => setView('Year')}
                    className={
                        `w-full sm:w-auto px-8 py-2 rounded-full font-medium transition-colors ${
                            view === 'Year'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`
                    }
                > {t('statistics.view.year')} </button>
            </div>
        )
    }



    const getXDomain = (view) => { //Helping function to have less clutter, simply sets min and max value for X-Axis.
        if(view === 'Day'){
            return [0, 24]
        }
        if(view === 'Week'){
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
        if(view === 'Month'){
            return ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
        }
        return [0, "auto"];
        /*statisticData.forEach(item => {

        })*/
    }
    const getXLabel = (view) => { //Helping function to have less clutter, simply returns the correct Label one each Button press.
        switch (view) {
            case 'Year':
                return "Month"
            case 'Month':
                return "Week"
            case 'Week':
                return "Day"
            case 'Day':
                return thisDate
        }
    }
    const getYDomain = (view) => { //Helping function to have less clutter, simply sets min and max value for Y-Axis.
        if (view === "Day") return [0, 1];
        if (view === "Week") return [0, 24];
        if (view === "Month") return [0, 80];
        if (view === "Year") return [0, 400];
        return [0, "auto"];
    }

    const Item = () =>{ // WIP: It was ment to make multiple Lines for variable amount of Categories, but The chart refused the input like this. Currently doesn't do anything and is WIP.
        statisticData.forEach(item => {
            return (<Line
                    type="monotone"
                    dataKey={item.time}
                    name={item.name}
                    strokeWidth={2}/>
            )
        })
    }

    const LineCharts =() =>{ //Very Bugged, refuses to take data for multiple categories unless handwritten <Line /> inputs. Breaks & Bugs easily.
        return (
            <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 1100 }} responsive data={statisticData}>

                <XAxis domain={getXDomain(view)}> <Label value={getXLabel(view)} position="insideBottom"/> </XAxis>
                <YAxis domain={getYDomain(view)}> <Label value="Hours" angle={-90} position="insideLeft"/> </YAxis>
                <CartesianGrid strokeDasharray="6 6"/>

                <Legend layout="vertical" verticalAlign="middle" align="right"/>

                <Line
                    type="monotone"
                    dataKey={'time'}
                    name={'Math'} //it should be "name={'name'} using the data with the Key name as the lines Name but for some reason only takes it as string.
                    strokeWidth={2}/>


                <Tooltip />
            </LineChart>
        );
    }




    const DateSelect = () => { //Selecting a calender Day for specific Day view. On its own works, but the statistic just takes all data and not just the date specific ones.
        return (
            <div className="flex">
                <button
                    onClick={() => setPopupOpen(true)}
                >
                </button>
                <popup display="center" isOpen={popupOpen} onClose={()=> setPopupOpen(false)}>
                    <input
                        type="date"
                        value={thisDate}
                        onChange={(e) => setThisDate(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </popup>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full justify-center min-w-full gap-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
            <div className="flex flex-col gap-4"></div> {/*Layout-Formating, otherwise the buttons were sticking to the top-bar*/}
            <div className="flex min-h-full max-w-full flex-col items-center gap-15 justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">

                <div className="flex justify-center gap-2">
                    <Buttons />
                </div>
                <div className="flex justify-items-end gap-2" >
                    <DateSelect />
                </div>
                <div
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    style={{ /*Container for the Chart, Responsive Container doesn't work as an alternative because it visibly deletes the Chart.*/
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    algin: 'center',
                    width: '80%',
                    padding: '25px'
                }}>

                    <LineCharts />
                </div>

            </div>
        </div>
    );
}
