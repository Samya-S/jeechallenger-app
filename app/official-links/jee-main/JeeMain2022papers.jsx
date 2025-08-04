import { FaFilePdf, FaCalendarAlt } from "react-icons/fa";

const JeeMain2022papers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-900 dark:to-teal-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            JEE Main 2022
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 dark:text-emerald-200 mb-8">
            Question Papers with Answer Keys & Solutions
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-emerald-100 dark:text-emerald-200">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-2xl" />
              <span className="text-lg">Complete Exam Papers</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaFilePdf className="text-2xl" />
              <span className="text-lg">PDF Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-12">
        <style jsx>{`
          .table-outer {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            // border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: inline-block;
            width: fit-content;
            max-width: 100%;
          }
          table {
            min-width: 600px;
            border-collapse: collapse;
            background: white;
          }
          :global(.dark) table {
            background: #1f2937;
          }
          th, td {
            border: 1px solid #d1d5db !important;
            border-collapse: collapse;
            padding: 8px 12px;
            white-space: nowrap;
            text-align: center;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
          }
          :global(.dark) th {
            background-color: #374151;
            color: #f9fafb;
          }
          table tbody td a {
            text-decoration: none;
            color: #10b981;
            transition: all 0.3s ease;
            display: inline-block;
            padding: 2px 4px;
            border-radius: 4px;
            white-space: nowrap;
          }
          table tbody td a:hover {
            color: #059669;
            transform: translateY(-1px);
          }
          table tbody td a svg {
            transition: all 0.3s ease;
            display: inline-block;
          }
          table tbody td a:hover svg {
            transform: scale(1.3) rotate(5deg);
            color: #059669;
            filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3));
          }
          .dark table tbody td a {
            color: #6ee7b7 !important;
          }
          .dark table tbody td a:hover {
            color: #a7f3d0 !important;
          }
          .dark table tbody td a:hover svg {
            color: #a7f3d0 !important;
            filter: drop-shadow(0 2px 4px rgba(110, 231, 183, 0.3));
          }
        `}</style>

        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 flex items-center justify-center space-x-4 text-left md:text-center px-4 py-6">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 text-2xl flex-shrink-0" />
            <span>JEE Main 2022 Session-2 Paper with Answer Key (July Attempt)</span>
          </h2>
          <div className="table-outer">
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <th width="15%">Date</th>
                  <th width="25%" className="center">Shift</th>
                  <th width="20%" className="center">Physics</th>
                  <th width="20%" className="center">Chemistry</th>
                  <th width="20%" className="center">Maths</th>
                </tr>
                <tr>
                  <td rowSpan="2">25 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Physics-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Mathematics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Physics-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Chemistry-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2507-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">26 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Physics-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Mathematics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Physics-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Chemistry-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2607-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">27 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Physics-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Mathematics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Physics-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Chemistry-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2707-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">28 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Physics-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Mathematics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Physics-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Chemisty-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2807-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">29 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Physics-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Mathematics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Physics-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Chemistry-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-answer/2907-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 flex items-center justify-center space-x-4 text-left md:text-center px-4 py-6">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 text-2xl flex-shrink-0" />
            <span>JEE Main 2022 Session-2 Paper with Solutions (July Attempt)</span>
          </h2>
          <div className="table-outer">
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <th width="15%">Date</th>
                  <th width="25%" className="center">Shift</th>
                  <th width="20%" className="center">Physics</th>
                  <th width="20%" className="center">Chemistry</th>
                  <th width="20%" className="center">Maths</th>
                </tr>
                <tr>
                  <td rowSpan="2">25 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Mathematics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2507-Mathematics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">26 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Mathematics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2607-Mathematics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">27 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Mathematics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2707-Mathematics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">28 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Mathematics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Chemisty-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2807-Mathematics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">29 July 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Mathematics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Chemisty-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                  <td align="center">
                    <a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/july-2022/paper-with-solutions/2907-Mathematics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 flex items-center justify-center space-x-4 text-left md:text-center px-4 py-6">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 text-2xl flex-shrink-0" />
            <span>JEE Main 2022 Session-1 Paper with Answer Key (June Attempt)</span>
          </h2>
          <div className="table-outer">
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <th width="15%">Date</th>
                  <th width="25%" className="center">Shift</th>
                  <th width="20%" className="center">Physics</th>
                  <th width="20%" className="center">Chemistry</th>
                  <th width="20%" className="center">Maths</th>
                </tr>
                <tr>
                  <td rowSpan="2">24 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Chemistry-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2406-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">25 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Chemistry-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Chemistry-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2506-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">26 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Chemistry-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Chemistry-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2606-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">27 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Chemistry-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Chemistry-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2706-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">28 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Chemistry-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Chemistry-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2806-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">29 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Physics-Paper-With-Answer-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Chemistry-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Maths-Paper-With-Ans-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Physics-Paper-With-Answer-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Chemistry-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-answer/2906-Maths-Paper-With-Ans-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td>30 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center" colSpan="3">
                    <a
                      href="https://t.me/c/1655397860/329"
                      target="_blank"
                      onClick={(e) => {
                        if (!confirm(
                          'This link will only work if you are a subscriber of our official telegram channel. If so, please proceed. \n\nOr else, please join our telegram channel before proceeding.'
                        )) e.preventDefault();
                      }}
                    >
                      <FaFilePdf className="inline mb-1" /> Official Paper with answer key
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 flex items-center justify-center space-x-4 text-left md:text-center px-4 py-6">
            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 text-2xl flex-shrink-0" />
            <span>JEE Main 2022 Session-1 Paper with Solutions (June Attempt)</span>
          </h2>
          <div className="table-outer">
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <th width="15%">Date</th>
                  <th width="25%" className="center">Shift</th>
                  <th width="20%" className="center">Physics</th>
                  <th width="20%" className="center">Chemistry</th>
                  <th width="20%" className="center">Maths</th>
                </tr>
                <tr>
                  <td rowSpan="2">24 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2406-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">25 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Physics-Paper-With-solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2506-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">26 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2606-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">27 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Physics-Paper-With-Solutions-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2706-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">28 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2806-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td rowSpan="2">29 June 2022</td>
                  <td align="center">Shift 1 (9:00 AM – 12:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Physics-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Chemistry-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Maths-Paper-With-Solution-Morning.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
                <tr>
                  <td align="center">Shift 2 (3:00 PM – 06:00 PM)</td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Physics-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Chemistry-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                  <td align="center"><a href="https://allenwebsite-general.s3.ap-south-1.amazonaws.com/allen-website/answerkey/jeemain/june-2022/paper-with-solutions/2906-Maths-Paper-With-Solution-Evening.pdf" target="_blank"><FaFilePdf className="inline mb-1" /> Download</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JeeMain2022papers
