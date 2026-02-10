import React, { useState, useEffect } from 'react';

const FlashSale = () => {
    const [time, setTime] = useState({
        hours: 9,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prevTime => {
                let { hours, minutes, seconds } = prevTime;
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 9;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (num) => num.toString().padStart(2, '0');

    return (
        <div className="binhtong1">
            <div className="giovang">
                <div>
                    <i className="fa-solid fa-bolt" />
                </div>
                <div className="txt1giovang">GIỜ VÀNG DEAL SỐC</div>
                <div className="box1giovang">
                    <div className="txt1box1giovang">Nhanh lên nào!</div>
                    <div className="txt2box1giovang">Sự kiện sẽ kết thúc sau</div>
                </div>
                <div className="boxclock">
                    <div className="clock">
                        <div className="font-clock">
                            <div id="hour">{formatTime(time.hours)}</div>
                            <p>Giờ</p>
                        </div>
                    </div>
                    <div className="clock">
                        <div className="front-clock">
                            <div id="minute">{formatTime(time.minutes)}</div>
                            <p>Phút</p>
                        </div>
                    </div>
                    <div className="clock">
                        <div className="font-clock">
                            <div id="second">{formatTime(time.seconds)}</div>
                            <p>Giây</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashSale;
