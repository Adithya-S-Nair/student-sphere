import React from "react";
import { Link } from 'react-router-dom'
import styled, { css } from "styled-components";
import nike1 from "../Images/1.png";
import nike2 from "../Images/2.png";
import nike3 from "../Images/3.png";

const data = [
    {
        id: 1,
        image: nike1,
        title: "Create New Batch",
        bg: "#ffffff",
        size: "",
    },
    {
        id: 2,
        image: nike2,
        title: "Attendance Management",
        bg: "#ffffff",
        size: "",
    },
    {
        id: 3,
        image: nike3,
        title: "Marks Management",
        bg: "#ffffff",
        size: "",
    },
];

const Card = ({ prodImg, imgSize, bgColor, prodTitle }) => {
    return (
        <CardWrapper bgColor={bgColor}>
            <ImgBox className="imgBox">
                <img className="image" src={prodImg} alt="" />
            </ImgBox>
            <ContentBox className="contentBox">
                <h2>{prodTitle}</h2>
                <button className="bt-lg">
                    {prodTitle === 'Create New Batch' && <Link Link href="./AddBatch.jsx">Assign</Link>}
                    {prodTitle === 'Attendance Management' && <Link Link href="./AttendanceMarking.jsx">Assign</Link>}
                    {prodTitle === 'Marks Management' && <Link Link href="./.jsx">Assign</Link>}
                </button>
            </ContentBox >
        </CardWrapper >
    );
};

const FacultyHome = () => {
    return (
        <>
            <div>
                <Container>
                    {data.map((item) => (
                        <Card
                            key={item.id}
                            prodImg={item.image}
                            imgSize={""}
                            bgColor={item.bg}
                            prodTitle={item.title}
                        />
                    ))}
                </Container>
            </div>
            <div
                className="d-flex align-items-center justify-content-center"
                style={{
                    'position': 'fixed',
                    'top': '2em',
                    'right': '2em',
                }}
            >

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{
                    'width': '2em',
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{
                    'width': '2em',
                    'transform': 'rotate(180deg)'
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg >
                <p className="pt-1 text-dark">Logout</p>
            </div >
        </>
    );
};

export default FacultyHome;

const Container = styled.div`
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;

            @media (max-width: 768px) {
                gap: 10px;
  }
            `;

const cardStyles = css`
            position: relative;
            width: 320px;
            height: 350px;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;

            &:before {
                content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${(props) => props.bgColor || "#e93337"};
            clip-path: circle(150px at 80% 20%);
            transition: 0.5s ease-in;
  }
            &:hover:before {
                clip-path: circle(400px at 80% -20%);
  }

            &:after {
                content: "NIKE";
            position: absolute;
            top: 30%;
            left: -20%;
            font-size: 10rem;
            font-weight: 800;
            font-style: italic;
            color: rgba(255, 255, 255, 0.6);
  }
            &:hover .imgBox {
                top: 0%;
            transform: translateY(0%);
  }

            @media (max-width: 768px) {
                width: 100%;
            max-width: 300px;
  }
            `;

const CardWrapper = styled.div`
            ${cardStyles}

            box-shadow: 0px 8px 15px -4px rgba(0,0,0,0.3);
            &:hover .contentBox {
                height: 210px;
  }
            &:hover .contentBox .size {
                opacity: 1;
            visibility: visible;
            transition-delay: 0.5s;
  }
            &:hover .contentBox .color {
                opacity: 1;
            visibility: visible;
            transition-delay: 0.75s;
  }
            &:hover .contentBox button {
                opacity: 1;
            transform: translateY(0);
            transition-delay: 0.75s;
  }
            @media (max-width: 768px) {
                height: auto;
  }
            `;

const ImgBox = styled.div`
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20;
            width: 100%;
            height: 150px;
            transition: 0.5s;

            img {
                position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -50%) rotate(-1deg);
            width: 100px;
  }
            `;

const ContentBox = styled.div`
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100px;
            text-align: center;
            transition: 1s;
            z-index: 10;

            h2 {
                position: relative;
            font-weight: 600;
            letter-spacing: 1px;
            color: #242424;
}

            .size,
            .color {
                display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 20px;
            transition: 0.5s;
            opacity: 0;
            visibility: hidden;
            h3 {
                color: #242424;
            font-weight: 300;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-right: 10px;
    }

}

            button {
                display: inline - block;
            padding: 10px 20px;
            background-color: #394dfe;
            color: #fff;
            border-radius: 4px;
            margin-top: 10px;
            cursor: pointer;
            font-weight: 600;
            opacity: 0;
            transform: translateX(50px);
            transition: 0.5s;
}

            ${CardWrapper}:hover&{
                height: 210px;
}

            ${CardWrapper}:hover.size {
                opacity: 1;
            visibility: visible;
            transition-delay: 0.5s;
}

            ${CardWrapper}:hover.color {
                opacity: 1;
            visibility: visible;
            transition-delay: 0.75s;
}

            ${CardWrapper}:hover button {
                opacity: 1;
            transform: translateY(0);
            transition-delay: 0.75s;
}

            @media (max-width: 768px) {
                height: auto;
}
            `;
