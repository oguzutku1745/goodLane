import 'flatpickr/dist/themes/airbnb.css';
import Flatpickr from 'react-flatpickr';

interface DateProps {
  endDate: Date;
  setEndDate: (date: Date) => void;
}

export default function DatePicker({ endDate, setEndDate }: DateProps) {
  const handleDateSelect = (date: Date) => {
    setEndDate(date);
  };

  return (
    <div className="container mx-auto col-span-6 sm:col-span-6 mt-5">
      <label htmlFor="datetime" className="flex-grow block font-medium text-sm text-gray-700 mb-1">
        Date and Time
      </label>
      <div className="flex align-middle align-content-center">
        <Flatpickr
          data-enable-time
          value={endDate}
          onChange={(selectedDates: any) => {
            handleDateSelect(selectedDates[0]);
          }}
          options={{
            dateFormat: 'M j, Y h:i K',
          }}
          className="block w-full px-2 bg-gray-200 text-gray-700 border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-l-md shadow-sm"
        />
      </div>
    </div>
  );
}
