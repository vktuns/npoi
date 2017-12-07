using NPOI.HSSF.UserModel;
using NPOI.SS.Converter;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NPOI.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ExcelToHtml()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetExcel()
        {
            HttpPostedFileBase file = Request.Files[0];

            var tempPath = "~/ShareFile/heatFeeDoc/" + file.FileName;
            var filePath = Server.MapPath(tempPath);
            file.SaveAs(filePath);
            tempPath = Server.MapPath(tempPath);
            if (System.IO.File.Exists(tempPath))
            {
                IWorkbook workbook = null;
                try
                {
                    using (FileStream fs = new FileStream(tempPath, FileMode.Open, FileAccess.Read))
                    {
                        workbook = new HSSFWorkbook(fs);
                        fs.Close();
                    }
                }
                catch
                {
                    using (FileStream fs = new FileStream(tempPath, FileMode.Open, FileAccess.Read))
                    {
                        workbook = new XSSFWorkbook(fs);
                        fs.Close();
                    }
                }
                ExcelToHtmlConverter eth = new ExcelToHtmlConverter();
                // 设置输出参数
                eth.OutputColumnHeaders = false;
                eth.OutputHiddenColumns = false;
                eth.OutputHiddenRows = false;
                eth.OutputLeadingSpacesAsNonBreaking = true;
                eth.OutputRowNumbers = false;
                eth.UseDivsToSpan = true;

                // 处理的Excel文件
                eth.ProcessWorkbook(workbook);
                //添加表格样式
                eth.Document.InnerXml = eth.Document.InnerXml.Insert(
                        eth.Document.InnerXml.IndexOf("<head>", 0) + 6,
                        @"<style> div h2{display:none}</style>"
                    );
                var a = eth.Document.InnerText;
                var b = eth.Document.InnerXml;
                var c = eth.Document.NameTable;
                //方法一
                return Json(eth.Document.InnerXml);
            }
            return Json("");
        }
    }
}