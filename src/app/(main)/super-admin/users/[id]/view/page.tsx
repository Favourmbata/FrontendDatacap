"use client";

import SuperAdminUserView from "@/modules/super-admin/user/view";


const ViewCustomerPage = () => {
  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <SuperAdminUserView />
      </div>
    </div>
  );
};

export default ViewCustomerPage;