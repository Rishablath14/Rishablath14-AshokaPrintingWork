"use client";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { CustomerContext } from "@/app/_components/CustomerContext";

const page = ({ params }) => {
  const { addCustomercont, getCustomercont } = useContext(CustomerContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    expectedDeliveryDate: "",
    partyName: "",
    address: "",
    mobile: "",
    email: "",
    gstNo: "",
    company: "apw",
    billNumber: "",
    totalAmount: "",
    advance: "",
    isCompleted: "progress",
    mediaCount: 1,
    mediaDetails: [],
    fileDetails: {
      pc: "1",
      fileName: "",
      software: "",
      totalBookQuantity: "",
      leavesPerBook: "",
      padQuantity: "",
      leavesPerPad: "",
      paperSize: "",
      paperQuality: "",
      gramWeightOfPaper: "",
      printCopies: {
        quantity: "",
        sides: "",
      },
      watermarkPage: "",
      inkColor: "",
      paperColor: {
        firstCopy: "",
        secondCopy: "",
        thirdCopy: "",
        fourthCopy: "",
        fifthCopy: "",
      },
      graph: "",
      printType: "",
      screenPrintingColor: "",
      stickerSheetSize: "",
      stickerSheetColor: "",
      serialNumFrom: "",
      serialNumTo: "",
      bookNumFrom: "",
      bookNumTo: "",
      perforation: "",
      perforationCopy: "",
      PaperCutSize: "",
      paperCSize: "",
      plateNumber: "",
      binding: {
        bindType: "",
        bothSideCraft: "",
        pad: "",
        register: "",
      },
      vinylSize: "",
      sunBoardSize: "",
      rediumSize: "",
      stickerMultiCol: "",
      vCardsMCol: "",
      vCardsBothSide: "",
      vCardsXeroxCol: "",
      vCardsLamination: "",
      laminationAdd: "",
      vCardsLaminationAdd: "",
      xerox: {
        colorXerox: "",
        singleSide: "",
        quantity: "",
        size: "",
      },
      idCard: {
        idType: "",
        side: "",
        quantity: "",
      },
      pdfPigmentation: {
        single: "",
        size: "",
        quantity: "",
        spiralBinding: "",
        otherJobs: "",
        otherSize: "",
        otherQuantity: "",
      },
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomercont(params.id);
        if (data && data.length > 0) {
          const oneCustomer = data[0];
          setFormData({
            ...formData,
            partyName: oneCustomer.partyName,
            address: oneCustomer.address,
            mobile: oneCustomer.mobile,
            email: oneCustomer.email,
            gstNo: oneCustomer.gstNo,
          });
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, [params.id, getCustomercont]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("fileDetails.") || name.startsWith("mediaDetails.")) {
      const keys = name.split(".");
      setFormData((prevFormData) => {
        let updatedFormData = { ...prevFormData };
        let temp = updatedFormData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!temp[keys[i]]) temp[keys[i]] = {};
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = value;
        return updatedFormData;
      });
    } else if (name === "mediaCount") {
      if(!value) return;
      const count = parseInt(value, 10);
      if (count < 0) return; // Prevent negative values

      setFormData((prevFormData) => {
        const currentDetails = prevFormData.mediaDetails;

        // Create a new array of media details with the desired length
        const updatedMediaDetails = Array(count)
          .fill({})
          .map((_, i) => {
            return currentDetails[i] || { type: "", rate: "", size: "" };
          });

        return {
          ...prevFormData,
          mediaCount: count,
          mediaDetails: updatedMediaDetails,
        };
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastid = toast.loading("Adding..");
    const orderDate = new Date(formData.date);
    const deliveryDate = new Date(formData.expectedDeliveryDate);
    if (orderDate > deliveryDate) {
      toast.error("order date must be less than or equal to delivery date", {
        id: toastid,
      });
      setLoading(false);
      return;
    }
    try {
      await addCustomercont(formData);
      toast.success("Customer Saved Successfully", { id: toastid });
      setFormData({
        date: "",
        expectedDeliveryDate: "",
        partyName: formData.partyName,
        address: formData.address,
        mobile: formData.mobile,
        email: formData.email,
        gstNo: formData.gstNo,
        company: "apw",
        billNumber: "",
        totalAmount: "",
        advance: "",
        mediaCount: 1,
        mediaDetails: [],
        isCompleted: "progress",
        fileDetails: {
          pc: "1",
          fileName: "",
          software: "",
          totalBookQuantity: "",
          leavesPerBook: "",
          padQuantity: "",
          leavesPerPad: "",
          paperSize: "",
          paperQuality: "",
          gramWeightOfPaper: "",
          printCopies: {
            quantity: "",
            sides: "",
          },
          watermarkPage: "",
          inkColor: "",
          paperColor: {
            firstCopy: "",
            secondCopy: "",
            thirdCopy: "",
            fourthCopy: "",
            fifthCopy: "",
          },
          graph: "",
          printType: "",
          screenPrintingColor: "",
          stickerSheetSize: "",
          stickerSheetColor: "",
          serialNumFrom: "",
          serialNumTo: "",
          bookNumFrom: "",
          bookNumTo: "",
          perforation: "",
          perforationCopy: "",
          paperCSize: "",
          PaperCutSize: "",
          plateNumber: "",
          binding: {
            bindType: "",
            bothSideCraft: "",
            pad: "",
            register: "",
          },
          vinylSize: "",
          sunBoardSize: "",
          rediumSize: "",
          stickerMultiCol: "",
          vCardsMCol: "",
          vCardsBothSide: "",
          vCardsXeroxCol: "",
          vCardsLamination: "",
          laminationAdd: "",
          vCardsLaminationAdd: "",
          xerox: {
            colorXerox: "",
            singleSide: "",
            quantity: "",
            size: "",
          },
          idCard: {
            idType: "",
            side: "",
            quantity: "",
          },
          pdfPigmentation: {
            single: "",
            size: "",
            quantity: "",
            spiralBinding: "",
            otherJobs: "",
            otherSize: "",
            otherQuantity: "",
          },
        },
      });
    } catch (error) {
      console.error("Error creating user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <form
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-4"
        onSubmit={handleCreate}
      >
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Order Date:&nbsp;
          </label>
          <input
            autoFocus
            className="p-1 border dark:border-white dark:bg-slate-950 border-black w-full"
            type="date"
            name="date"
            value={formData.date}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Delivery Date:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black w-full"
            type="date"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Party Name:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="partyName"
            value={formData.partyName}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Address:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="address"
            value={formData.address}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Contact Number:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="mobile"
            value={formData.mobile}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Email:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Gst No.:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Company:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black text-center"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          >
            <option value="apw">APW</option>
            <option value="sre">SRE</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Bill No.:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Total Amount:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Advance:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="advance"
            value={formData.advance}
            required={true}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Work PC:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black text-center"
            type="text"
            name="fileDetails.pc"
            value={formData.fileDetails.pc}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            File Name:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.fileName"
            value={formData.fileDetails.fileName}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Softwares:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.software"
            value={formData.fileDetails.software}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Total Book Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.totalBookQuantity"
            value={formData.fileDetails.totalBookQuantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Leaves Per Book:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.leavesPerBook"
            value={formData.fileDetails.leavesPerBook}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Total Pad Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.padQuantity"
            value={formData.fileDetails.padQuantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Leaves Per Pad/pkt.:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.leavesPerPad"
            value={formData.fileDetails.leavesPerPad}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Paper Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperSize"
            value={formData.fileDetails.paperSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Paper Quality:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperQuality"
            value={formData.fileDetails.paperQuality}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Gram Weight Of Paper:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.gramWeightOfPaper"
            value={formData.fileDetails.gramWeightOfPaper}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Print Copies:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.printCopies.quantity"
            value={formData.fileDetails.printCopies.quantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Printing:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black text-center"
            type="text"
            name="fileDetails.printCopies.sides"
            value={formData.fileDetails.printCopies.sides}
            onChange={handleChange}
          >
            <option value="">Select Side</option>
            <option value="single">Single Side</option>
            <option value="both">Both Side</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Watermark Printing:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black text-center"
            type="text"
            name="fileDetails.watermarkPage"
            value={formData.fileDetails.watermarkPage}
            onChange={handleChange}
          >
            <option value="">Select Yes/No</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Printing Ink Colour:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.inkColor"
            value={formData.fileDetails.inkColor}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Colour of Paper 1:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperColor.firstCopy"
            value={formData.fileDetails.paperColor.firstCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Colour of Paper 2:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperColor.secondCopy"
            value={formData.fileDetails.paperColor.secondCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Colour of Paper 3:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperColor.thirdCopy"
            value={formData.fileDetails.paperColor.thirdCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Colour of Paper 4:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperColor.fourthCopy"
            value={formData.fileDetails.paperColor.fourthCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Colour of Paper 5:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperColor.fifthCopy"
            value={formData.fileDetails.paperColor.fifthCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Graph:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.graph"
            value={formData.fileDetails.graph}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Printing Type:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.printType"
            value={formData.fileDetails.printType}
            onChange={handleChange}
          >
            <option value="">Select Colour Type</option>
            <option value="single">Single Colour</option>
            <option value="double">Double Colour</option>
            <option value="multi">Multi Colour</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Screen Printing Color:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.screenPrintingColor"
            value={formData.fileDetails.screenPrintingColor}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Sticker Sheet Color:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.stickerSheetColor"
            value={formData.fileDetails.stickerSheetColor}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Sticker Sheet Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.stickerSheetSize"
            value={formData.fileDetails.stickerSheetSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Serial No. From:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.serialNumFrom"
            value={formData.fileDetails.serialNumFrom}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Serial No. To:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.serialNumTo"
            value={formData.fileDetails.serialNumTo}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Book Number From:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.bookNumFrom"
            value={formData.fileDetails.bookNumFrom}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Book Number To:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.bookNumTo"
            value={formData.fileDetails.bookNumTo}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Perforation:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.perforation"
            value={formData.fileDetails.perforation}
            onChange={handleChange}
          >
            <option value="">Select perforation type</option>
            <option value="normal">Normal</option>
            <option value="micro">Micro</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Perforation Copy:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.perforationCopy"
            value={formData.fileDetails.perforationCopy}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Paper Cut Type:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.PaperCutSize"
            value={formData.fileDetails.PaperCutSize}
            onChange={handleChange}
          >
            <option value="">Select Paper Cut</option>
            <option value="ver">Vertical</option>
            <option value="hori">Horizontal</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Paper Cut Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.paperCSize"
            value={formData.fileDetails.paperCSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Plate Number:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.plateNumber"
            value={formData.fileDetails.plateNumber}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Binding:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.binding.bindType"
            value={formData.fileDetails.binding.bindType}
            onChange={handleChange}
          >
            <option value="">Select Bind Type</option>
            <option value="2">
              Top Cover, Bottom Yellow Board & Cloth Patti / Normal
            </option>
            <option value="1">Top Cover, Bottom Yellow Board/ Spring</option>
            <option value="3">Normal</option>
            <option value="4">Both Side Brown Cover</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Both Side Craft Binding:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.binding.bothSideCraft"
            value={formData.fileDetails.binding.bothSideCraft}
            onChange={handleChange}
          >
            <option value="">Select Yes/No</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Pad:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.binding.pad"
            value={formData.fileDetails.binding.pad}
            onChange={handleChange}
          >
            <option value="">Select Binding Pad Type</option>
            <option value="normal">Normal</option>
            <option value="perforated">Perforated</option>
            <option value="packet">Packet</option>
            <option value="plastic">Plastic Pack</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Register:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.binding.register"
            value={formData.fileDetails.binding.register}
            onChange={handleChange}
          >
            <option value="">Select Register Type</option>
            <option value="clothcorner">Cloth Corner & patti</option>
            <option value="fullcloth">Full Cloth</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            vinyl Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.vinylSize"
            value={formData.fileDetails.vinylSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Sun Board Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.sunBoardSize"
            value={formData.fileDetails.sunBoardSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Redium Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.rediumSize"
            value={formData.fileDetails.rediumSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Number of Media:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="mediaCount"
            value={formData.mediaCount}
            onChange={handleChange}
          />
        </span>
        {Array.from({ length: formData.mediaCount }, (_, i) => (
          <div
            key={i}
            className="w-full grid grid-cols-3 col-span-1 sm:col-span-3 gap-8 md:gap-6 bg-slate-600 place-items-center border border-black dark:border-white p-1 rounded-md"
          >
            <span className="flex flex-col gap-2 w-full">
              <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
                Media Type {i + 1}:&nbsp;
              </label>
              <select
                className="p-1 border dark:border-white dark:bg-slate-950 border-black"
                name={`mediaDetails.${i}.type`}
                value={formData.mediaDetails[i]?.type || ""}
                onChange={handleChange}
              >
                <option value="">Select Media Type</option>
                <option value="vinyl">Vinyl</option>
                <option value="t-vinyl">T-Vinyl</option>
                <option value="retro">Retro</option>
                <option value="oneway">One Way</option>
                <option value="normal-flex">Normal Flex</option>
                <option value="star-flex">Star Flex</option>
              </select>
            </span>
            <span className="flex flex-col gap-2 w-full my-2">
              <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
                Media Rate {i + 1}:&nbsp;
              </label>
              <input
                className="p-1 border dark:border-white dark:bg-slate-950 border-black"
                type="number"
                name={`mediaDetails.${i}.rate`}
                value={formData.mediaDetails[i]?.rate || ""}
                onChange={handleChange}
              />
            </span>
            <span className="flex flex-col gap-2 w-full">
              <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
                Media Size {i + 1}:&nbsp;
              </label>
              <input
                className="p-1 border dark:border-white dark:bg-slate-950 border-black"
                type="text"
                name={`mediaDetails.${i}.size`}
                value={formData.mediaDetails[i]?.size || ""}
                onChange={handleChange}
              />
            </span>
          </div>
        ))}
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Sticker Multi Colour:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.stickerMultiCol"
            value={formData.fileDetails.stickerMultiCol}
            onChange={handleChange}
          >
            <option value="">Select Yes/No</option>
            <option value="true">yes</option>
            <option value="false">No</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            V.Cards Multi Colour:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.vCardsMCol"
            value={formData.fileDetails.vCardsMCol}
            onChange={handleChange}
          >
            <option value="">Select Yes/No</option>
            <option value="true">yes</option>
            <option value="false">No</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            V.cards Side:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.vCardsBothSide"
            value={formData.fileDetails.vCardsBothSide}
            onChange={handleChange}
          >
            <option value="">Select Side</option>
            <option value="true">Double Side</option>
            <option value="false">Single Side</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            V.cards Colour Xerox:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.vCardsXeroxCol"
            value={formData.fileDetails.vCardsXeroxCol}
            onChange={handleChange}
            placeholder="300/PVC GSM"
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            V.cards Lamination:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.vCardsLamination"
            value={formData.fileDetails.vCardsLamination}
            onChange={handleChange}
          >
            <option value="">Select Vcard Lamination</option>
            <option value="single">single Side</option>
            <option value="double">Double Side</option>
            <option value="uv">UV</option>
            <option value="gloss">Gloss</option>
            <option value="mat">Mat</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Add More:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.laminationAdd"
            value={formData.fileDetails.laminationAdd}
            onChange={handleChange}
          >
            <option value="">Select Yes/No</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </span>
        {formData.fileDetails.laminationAdd === "true" && (
          <span className="flex flex-col gap-2 w-full">
            <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
              V.cards Lamination Addon:&nbsp;
            </label>
            <select
              className="p-1 border dark:border-white dark:bg-slate-950 border-black"
              type="text"
              name="fileDetails.vCardsLaminationAdd"
              value={formData.fileDetails.vCardsLaminationAdd}
              onChange={handleChange}
            >
              <option value="">Select Vcard Lamination Addon</option>
              <option value="uv">UV</option>
              <option value="gloss">Gloss</option>
              <option value="mat">Mat</option>
            </select>
          </span>
        )}
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Xerox:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.xerox.colorXerox"
            value={formData.fileDetails.xerox.colorXerox}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="false">Black&White</option>
            <option value="true">Colour</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Xerox Side:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.xerox.singleSide"
            value={formData.fileDetails.xerox.singleSide}
            onChange={handleChange}
          >
            <option value="true">Single Side</option>
            <option value="false">Double Side</option>
            <option value="">Select Side</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Xerox Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.xerox.quantity"
            value={formData.fileDetails.xerox.quantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Xerox Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.xerox.size"
            value={formData.fileDetails.xerox.size}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            PDF Printing Side:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.single"
            value={formData.fileDetails.pdfPigmentation.single}
            onChange={handleChange}
          >
            <option value="">Select Side</option>
            <option value="true">Single</option>
            <option value="false">Both</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            PDF Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.size"
            value={formData.fileDetails.pdfPigmentation.size}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            PDF Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.pdfPigmentation.quantity"
            value={formData.fileDetails.pdfPigmentation.quantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            PDF Binding:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.spiralBinding"
            value={formData.fileDetails.pdfPigmentation.spiralBinding}
            onChange={handleChange}
          >
            <option value="">Select Bind Type</option>
            <option value="true">Spiral Binding</option>
            <option value="false">Hard Bind</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            ID Card Type:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.idCard.idType"
            value={formData.fileDetails.idCard.idType}
            onChange={handleChange}
          >
            <option value="">Select ID Card Type</option>
            <option value="pvc">PVC</option>
            <option value="board">Board</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            ID Card Side:&nbsp;
          </label>
          <select
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.idCard.side"
            value={formData.fileDetails.idCard.side}
            onChange={handleChange}
          >
            <option value="">Select ID Card Side</option>
            <option value="single">Single Side</option>
            <option value="both">Both Side</option>
          </select>
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            ID Card Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="number"
            name="fileDetails.idCard.quantity"
            value={formData.fileDetails.idCard.quantity}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Other Jobs:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.otherJobs"
            value={formData.fileDetails.pdfPigmentation.otherJobs}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Other Jobs Size:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.otherSize"
            value={formData.fileDetails.pdfPigmentation.otherSize}
            onChange={handleChange}
          />
        </span>
        <span className="flex flex-col gap-2 w-full">
          <label className="text-white font-bold p-1 border border-black rounded-md bg-zinc-900/100 dark:text-black dark:bg-slate-50 text-center">
            Other Jobs Quantity:&nbsp;
          </label>
          <input
            className="p-1 border dark:border-white dark:bg-slate-950 border-black"
            type="text"
            name="fileDetails.pdfPigmentation.otherQuantity"
            value={formData.fileDetails.pdfPigmentation.otherQuantity}
            onChange={handleChange}
          />
        </span>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 border-[1px] border-b-[4px] dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 hover:border-b-[1px] hover:bg-slate-50/80 transition-all dark:border-white border-zinc-950/90 block text-lg bg-slate-50 rounded-md text-black shadow-md font-bold col-span-1 sm:col-span-2 md:col-span-3"
        >
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default page;
