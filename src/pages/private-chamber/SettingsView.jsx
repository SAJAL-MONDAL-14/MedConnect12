import { useState } from "react";

function SettingsView({ doctor, setDoctor }) {
    const [name, setName] = useState(doctor.clinic_name || "");
    const [fee, setFee] = useState(doctor.consultations_fee?.toString() || "");
    const [isSaving, setIsSaving] = useState(false);

    const { id, owner_doctor_name, gmail, phone, speciality, medical_council_reg_no, experience, qualification, clinic_name, address, about_of_clinic, status } = JSON.parse(localStorage.getItem("clinic_doctor")) || {};

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.patch(`/api/private-chamber/update-clinic/${doctor.id}`, {
                clinic_name: clinic_name,
                consultations_fee: parseFloat(fee) || 0,
            });
            if (response.data.success) {
                const updatedDoctor = {
                    ...doctor,
                    clinic_name: clinic_name,
                    consultations_fee: parseFloat(fee) || 0,
                };
                localStorage.setItem("clinic_doctor", JSON.stringify(updatedDoctor));
                setDoctor(updatedDoctor);
                alert("Chamber settings updated successfully!");
            } else {
                alert(response.data.error || "Failed to save changes.");
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || error.message || "Failed to update settings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="rounded-xl bg-card border border-border p-6 space-y-4 max-w-2xl">
            <h2 className="font-semibold text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" /> Chamber settings
            </h2>
            <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Chamber name
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
            </div>
            <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Consultation fee (₹)
                </label>
                <input
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                />
            </div>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? "Saving..." : "Save changes"}
            </button>
        </div>
    );
}



export default SettingsView;