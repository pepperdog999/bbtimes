package com.cdqidi.bbtimes.util;

  
import javax.imageio.ImageIO;
import javax.swing.*;  

import java.io.File;  
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.util.HashMap;
import java.util.Map;
import java.awt.*;  
import java.awt.image.BufferedImage;  
import java.awt.image.Kernel;  
import java.awt.image.ConvolveOp;  
  
public class ImageUtil {  
  
    public static void resize(File originalFile, File resizedFile,  
            int newWidth, float quality) throws IOException {  
  
        if (quality > 1) {  
            throw new IllegalArgumentException(  
                    "Quality has to be between 0 and 1");  
        }  
        // 根据指定的文件创建一个 ImageIcon。
        ImageIcon ii = new ImageIcon(originalFile.getCanonicalPath()); 
       // 返回此图标的 Image
        Image i = ii.getImage();  
        Image resizedImage = null;  
  
        int iWidth = i.getWidth(null);  
        int iHeight = i.getHeight(null);  
  
        if (iWidth > iHeight) { 
        	/**
        	 * 参数：width - 将图像缩放到的宽度。
        	 *     height - 将图像缩放到的高度。
        	 *     hints - 指示用于图像重新取样的算法类型的标志。 
        	 * 返回：图像的缩放版本。 
        	 */
        	 resizedImage = i.getScaledInstance((newWidth * iWidth) / iHeight,  
                     newWidth, Image.SCALE_SMOOTH);  
        } else {  
           
            resizedImage = i.getScaledInstance(newWidth, (newWidth * iHeight)  
                    / iWidth, Image.SCALE_SMOOTH);  
        }  
  
        // This code ensures that all the pixels in the image are loaded.  
        Image temp = new ImageIcon(resizedImage).getImage();  
  
        // Create the buffered image. 创建一个 Graphics2D，可以将它绘制到此 BufferedImage 中 
        BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null),  
                temp.getHeight(null), BufferedImage.TYPE_INT_RGB);  
  
        // Copy image to buffered image.  
        Graphics g = bufferedImage.createGraphics();  
  
        // Clear background and paint the image.  
        g.setColor(Color.white);  
        g.fillRect(0, 0, temp.getWidth(null), temp.getHeight(null));  
        g.drawImage(temp, 0, 0, null);  
        g.dispose();  
  
        // Soften.  
        float softenFactor = 0.05f;  
        float[] softenArray = { 0, softenFactor, 0, softenFactor,  
                1 - (softenFactor * 4), softenFactor, 0, softenFactor, 0 };  
        Kernel kernel = new Kernel(3, 3, softenArray);  
        ConvolveOp cOp = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);  
        bufferedImage = cOp.filter(bufferedImage, null);  
  
        ImageIO.write(bufferedImage, /*"GIF"*/ "png" /* format desired */ , resizedFile /* target */ ); 
       
    } // Example usage
    
    public static Map<String, Long> getImgInfo(String imgpath) { 
        Map<String, Long> map = new HashMap<String, Long>(3); 
        File imgfile = new File(imgpath); 
        try { 
                FileInputStream fis = new FileInputStream(imgfile); 
                BufferedImage buff = ImageIO.read(imgfile); 
                map.put("w", buff.getWidth() * 1L); 
                map.put("h", buff.getHeight() * 1L); 
                map.put("s", imgfile.length()); 
                fis.close(); 
        } catch (FileNotFoundException e) { 
                System.err.println("所给的图片文件" + imgfile.getPath() + "不存在！计算图片尺寸大小信息失败！"); 
                map = null; 
        } catch (IOException e) { 
                System.err.println("计算图片" + imgfile.getPath() + "尺寸大小信息失败！"); 
                map = null; 
        } 
        return map; 
    }
  
    public static void main(String[] args) throws IOException {  
//       File originalImage = new File("C:\\11.jpg");  
//       resize(originalImage, new File("c:\\11-0.jpg"),150, 0.7f);  
//       resize(originalImage, new File("c:\\11-1.jpg"),150, 1f);  
         File originalImage = new File("C:\\Users\\CarlWu\\Desktop\\images.jpg");  
         resize(originalImage, new File("c:\\1207-0.png"),200, 0.7f);  
         resize(originalImage, new File("c:\\1207-1.png"),200, 1f);  
    }  
}